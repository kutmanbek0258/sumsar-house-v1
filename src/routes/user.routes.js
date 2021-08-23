'use strict';

const express = require('express');
const router = express.Router();
const config = require('../config/config.json');

const { jwtMiddleware: {
    verifyToken
} } = require('../helpers');

const { userController: {
    userAuthenticate,
    getProfile,
    changePassword,
    changePassword_V2,
    userRegister,
    userRegister_V2
} } = require('../controllers');

module.exports = app => {

    router.post('/authenticate', userAuthenticate);

    router.post('/register', userRegister);

    router.post('/register_v2', userRegister_V2);

    router.post('/password_v2', changePassword_V2);

    router.get('/user/:id', verifyToken, getProfile);

    router.put('/password', changePassword);

    app.use(config.api_v1 + '/users', router);

};
