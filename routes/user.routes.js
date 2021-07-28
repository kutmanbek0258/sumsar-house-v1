'use strict'

const express = require("express");
const router = express.Router();
const config = require("./../config/config");

const { userController: {
    userAuthenticate,
    getProfile,
    changePassword,
    changePasswordAfter,
    userRegister,
    userRegisterFast
} } = require("./../controllers")

module.exports = app => {

    router.post('/authenticate', userAuthenticate)

    router.post('/users', userRegister)

    router.post('/users_fast', userRegisterFast)

    router.post('/users_after/:id', changePasswordAfter)

    router.get('/users/:id', getProfile)

    router.put('/users/:id', changePassword)

    app.use(config.api_v1, router)

}

