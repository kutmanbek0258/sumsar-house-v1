'use strict'
const express = require("express");
const router = express.Router();
const config = require("./../config/config");

const { bannerController: {
    addBanner,
    removeBanner,
    getBanners
} } = require("./../controllers")

module.exports = app => {

    router.post('/add', addBanner)

    router.post('/remove', removeBanner)

    router.post('/list', getBanners)

    app.use(config.api_v1 + "/banner", router)

}