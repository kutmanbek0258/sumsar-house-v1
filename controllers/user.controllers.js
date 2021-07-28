'use strict'

const auth = require('basic-auth');
const shortid = require('shortid');
const jwt = require('jsonwebtoken');
const config = require('../config/config.json');
const { validator: {
    isPasswordValid
}, tokenHelper: {
    verifyToken
} } = require("./../helpers");
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

                res.status(result.status).json({ message: result.message, token: token });
            }else {
                res.status(result.status).json({ message: result.message })
            }
        }, err => {
            res.status(400).json({message: "Internal server error"})
        })
    }
}

exports.userRegister = async function(req, res){

    const name = req.body.name;
    let email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;

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

    const name = req.body.name;

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

    if (await verifyToken(req)) {

        const _id = req.body._id;
        const phone = req.body.phone;
        const newPassword = req.body.password;

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
    } else {

        res.status(401).json({ message: 'Invalid Token !' });
    }
}

exports.getProfile = async function (req, res){

    if (await verifyToken(req)) {

        await getProfile(req.params.id, result => {
            res.status(result.status).json(result)
        }, err => {
            res.status(err.status).json({ message: err.message })
        })

    } else {

        res.status(401).json({ message: 'Invalid Token !' });
    }
}

exports.changePassword_V2 = async function (req, res){

    if (await verifyToken(req)) {

        const oldPassword = req.body.password;
        const newPassword = req.body.newPassword;

        if (!oldPassword || !newPassword || !oldPassword.trim() || !newPassword.trim()) {

            res.status(400).json({ message: 'Invalid Request !' });

        } else {

            if(await isPasswordValid(newPassword)){
                await changePassword(req.body._id, oldPassword, newPassword, result => {
                    res.status(result.status).json({ message: result.message })
                }, err => {
                    res.status(err.status).json({ message: err.message })
                })
            }else{
                res.status(400).json({ message: "invalid_pass" })
            }

        }
    } else {

        res.status(401).json({ message: 'Invalid Token !' });
    }
}