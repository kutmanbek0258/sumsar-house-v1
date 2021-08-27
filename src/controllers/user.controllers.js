'use strict';

const auth = require('basic-auth');
const shortid = require('shortid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config.json');
const { validator: {
    isPasswordValid
}, apiHelper: {
    createPayload,
    createStatus
} } = require('../helpers');
const { userService: {
    getUserByPhone,
    changePassword,
    getProfile,
    registerUser
} } = require('../services');

exports.userAuthenticate = async function(req, res){

    const credentials = auth(req);
    let user = null;

    if (!credentials) {
        res.status(createStatus('e_invalid_request')).json(createPayload('e_invalid_request'));
        return;
    }

    try{
        const userData = await getUserByPhone(credentials.name);
        if(!userData){
            res.status(createStatus('e_user_not_exist')).json(createPayload('e_user_not_exist'));
            return;
        }
        user = userData[0];
    }catch (error){
        res.status(createStatus('e_server_error')).json(createPayload('e_server_error'));
        return;
    }

    if(bcrypt.compareSync(credentials.pass, user.hashed_password)){
        const token = jwt.sign(user, config.secret, { expiresIn: '365d' });
        res.status(createStatus('success')).json(createPayload('success', { token: token }));
    }else {
        res.status(createStatus('e_invalid_pass')).json(createPayload('e_invalid_pass'));
    }
};

exports.userRegister = async function(req, res){

    const {
        name,
        phone,
        password
    } = req.body;

    let {
        email
    } = req.body;

    console.log(req.body);

    if (!name || !phone || !password || !name.trim() || !phone.trim() || !password.trim()) {
        res.status(createStatus('e_invalid_request')).json(createPayload('e_invalid_request'));
        return;
    }

    if(!email){
        email = phone;
    }

    if(!await isPasswordValid(password)){
        res.status(createStatus('e_invalid_pass')).json(createPayload('e_invalid_pass'));
        return;
    }

    try{
        await registerUser(name, email, phone, password);
    }catch (error){
        if(error.code === 11000){
            res.status(createStatus('e_user_existed')).json(createPayload('e_user_existed'));
            return;
        }else {
            res.status(createStatus('e_server_error')).json(createPayload('e_server_error'));
            return;
        }
    }

    const token = jwt.sign(phone, config.secret, { expiresIn: '365d' });

    res.status(createStatus('success')).json(createPayload('success', { token: token }));
};

exports.userRegister_V2 = async function(req, res){

    const {
        name
    } = req.body;

    if (!name || !name.trim()) {
        res.status(createStatus('e_invalid_request')).json(createPayload('e_invalid_request'));
        return;
    }

    const phone = shortid.generate();
    const email = phone;
    const password = config.default_pass;

    if(!await isPasswordValid(password)){
        res.status(createStatus('e_invalid_pass')).json(createPayload('e_invalid_pass'));
        return;
    }

    try{
        await registerUser(name, email, phone, password);
    }catch (error){
        res.status(createStatus('e_server_error')).json(createPayload('e_server_error'));
        return;
    }

    const token = jwt.sign(phone, config.secret, { expiresIn: '365d' });

    res.status(createStatus('success')).json(createPayload('success', { token: token }));
};

exports.changePassword = async function (req, res){

    const {
        phone,
        newPassword
    } = req.body;

    let user = null;
    const oldPassword = config.default_pass;

    if (!phone || !newPassword || !phone.trim() || !newPassword.trim()) {
        res.status(createStatus('e_invalid_request')).json(createPayload('e_invalid_request'));
        return;
    }

    if(!await isPasswordValid(newPassword)){
        res.status(createStatus('e_invalid_pass')).json(createPayload('e_invalid_pass'));
        return;
    }

    try{
        const userData = await getUserByPhone(phone);
        if(!userData){
            res.status(createStatus('e_user_not_exist')).json(createPayload('e_user_not_exist'));
            return;
        }
        user = userData[0];
    }catch (error){
        res.status(createStatus('e_server_error')).json(createPayload('e_server_error'));
        return;
    }

    if(!bcrypt.compareSync(oldPassword, user.hashed_password)){
        res.status(createStatus('e_invalid_pass')).json(createPayload('e_invalid_pass'));
        return;
    }

    try{
        await changePassword(user._id, newPassword);
    }catch (error){
        res.status(createStatus('e_server_error')).json(createPayload('e_server_error'));
        return;
    }

    const token = jwt.sign(phone, config.secret, { expiresIn: '365d' });
    res.status(createStatus('success')).json(createPayload('success', { token: token }));
};

exports.getProfile = async function (req, res){

    const phone = req.params.id;
    let user = null;

    try{
        const userData = await getProfile(phone);
        if(!userData){
            res.status(createStatus('e_user_not_exist')).json(createPayload('e_user_not_exist'));
            return;
        }
        user = userData[0];
    }catch (error){
        res.status(createStatus('e_server_error')).json(createPayload('e_server_error'));
        return;
    }

    res.status(createStatus('success')).json(createPayload('success', { user: user }));
};

exports.changePassword_V2 = async function (req, res){

    const {
        phone,
        oldPassword,
        newPassword
    } = req.body;

    let user = null;

    if (!phone || oldPassword || !newPassword || !phone.trim() || oldPassword.trim() || !newPassword.trim()) {
        res.status(createStatus('e_invalid_request')).json(createPayload('e_invalid_request'));
        return;
    }

    if(!await isPasswordValid(newPassword)){
        res.status(createStatus('e_invalid_pass')).json(createPayload('e_invalid_pass'));
        return;
    }

    try{
        const userData = await getUserByPhone(phone);
        if(!userData){
            res.status(createStatus('e_user_not_exist')).json(createPayload('e_user_not_exist'));
            return;
        }
        user = userData[0];
    }catch (error){
        res.status(createStatus('e_server_error')).json(createPayload('e_server_error'));
        return;
    }

    if(!bcrypt.compareSync(oldPassword, user.hashed_password)){
        res.status(createStatus('e_invalid_pass')).json(createPayload('e_invalid_pass'));
        return;
    }

    try{
        await changePassword(user._id, newPassword);
    }catch (error){
        res.status(createStatus('e_server_error')).json(createPayload('e_server_error'));
        return;
    }

    const token = jwt.sign(phone, config.secret, { expiresIn: '365d' });
    res.status(createStatus('success')).json(createPayload('success', { token: token }));
};