'use strict'
const express = require("express");
const router = express.Router();
const config = require("./../config/config");

const { jwtMiddleware: {
    verifyToken
} } = require("./../helpers")

const { bannerController: {
    addBanner,
    removeBanner,
    getBanners
} } = require("./../controllers")

module.exports = app => {

    router.post('/add/:id', verifyToken, addBanner)

    router.post('/remove/:id', verifyToken, removeBanner)

    router.post('/list/:id', verifyToken, getBanners)

    app.use(config.api_v1 + "/banner", router)

}