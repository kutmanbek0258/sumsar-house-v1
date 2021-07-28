'use strict'

const auth = require('basic-auth');
const shortid = require('shortid');
const jwt = require('jsonwebtoken');
const config = require('../config/config.json');
const { validator: {
    isPasswordValid
}} = require("./../helpers");
const { userService: {
    loginUser,
    changePassword,
    getProfile,
    registerUser
}} = require("./../services")

exports.userAuthenticate = async function(req, res){

    const credentials = auth(req);

    if (!credentials) {

        res.status(400).json({ message: 'Invalid Request !' });

    } else {

        await loginUser(credentials.name, credentials.pass, result =>{
            if(result.status === 200){
                const token = jwt.sign(result.user, config.secret, { expiresIn: "365d" });

                res.status(result.status).json({ user: result.user, token: token });
            }else {
                res.status(result.status).json({ message: result.message })
            }
        }, err => {
            res.status(400).json({message: "Internal server error"})
        })
    }
}

exports.userRegister = async function(req, res){

    const {
        name,
        phone,
        password
    } = req.body

    let {
        email
    } = req.body

    console.log(req.body);

    if (!name || !phone || !password || !name.trim() || !phone.trim() || !password.trim()) {

        res.status(400).json({message: 'Invalid Request !'});

    } else {

        if(!email){
            email = phone;
        }

        if(await isPasswordValid(password)){
            await registerUser(name, email, phone, password, result => {
                if(result.status === 200){
                    const token = jwt.sign(result, config.secret, { expiresIn: "365d" });

                    res.status(result.status).json({ message: result.message, token: token });
                }else {
                    res.status(result.status).json({ message: result.message })
                }
            }, err => {
                res.status(err.status).json({message: err.message})
            })
        }else{
            res.status(400).json({ message: "invalid_pass" })
        }

    }
}

exports.userRegister_V2 = async function(req, res){

    const {
        name
    } = req.body

    if (!name || !name.trim()) {

        res.status(400).json({message: 'Invalid Request !'});

    } else {

        const phone = shortid.generate();
        const email = phone;
        const password = config.default_pass;

        if(await isPasswordValid(password)){
            await registerUser(name, email, phone, password, result => {
                const token = jwt.sign(result, config.secret, { expiresIn: "365d" });

                res.status(result.status).json({ message: result.message, token: token });
            }, err => {
                res.status(err.status).json({ message: err.message })
            })
        }else{
            res.status(400).json({ message: "invalid_pass" })
        }

    }
}

exports.changePassword = async function (req, res){

    const {
        _id,
        phone,
        newPassword
    } = req.body

    if (!_id || !phone || !newPassword || !_id.trim() || !phone.trim() || !newPassword.trim()) {

        res.status(400).json({ message: 'Invalid Request !' });

    } else {

        if(await isPasswordValid(newPassword)){
            await changePassword(_id, phone, newPassword, result => {
                const token = jwt.sign(result, config.secret, { expiresIn: "365d" });

                res.status(result.status).json({ message: result.message, token: token })
            }, err => {
                res.status(err.status).json({ message: err.message })
            })
        }else{
            res.status(400).json({ message: "invalid_pass" })
        }

    }
}

exports.getProfile = async function (req, res){

    await getProfile(req.params.id, result => {
        res.status(result.status).json(result)
    }, err => {
        res.status(err.status).json({ message: err.message })
    })
}

exports.changePassword_V2 = async function (req, res){

    const {
        password,
        newPassword
    }= req.body

    if (!password || !newPassword || !password.trim() || !newPassword.trim()) {

        res.status(400).json({ message: 'Invalid Request !' });

    } else {

        if(await isPasswordValid(newPassword)){
            await changePassword(req.body._id, password, newPassword, result => {
                res.status(result.status).json({ message: result.message })
            }, err => {
                res.status(err.status).json({ message: err.message })
            })
        }else{
            res.status(400).json({ message: "invalid_pass" })
        }

    }
}