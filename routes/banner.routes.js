'use strict'
const express = require("express");
const router = express.Router();

const { bannerController: {
    addBanner,
    removeBanner,
    getBanners
} } = require("./../controllers")

module.exports = app => {

    router.post('/banner_add/:id', addBanner)

    router.post('/banner_remove/:id', removeBanner)

    router.post('/banner_list', getBanners)

    app.use(router)

}