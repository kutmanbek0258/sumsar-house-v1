'use strict'
const express = require("express");
const router = express.Router();
const config = require("./../config/config");

const { favoriteController: {
    addFavorite,
    getFavorites,
    clearFavorite
} } = require("./../controllers")

module.exports = app => {

    router.post('/add', addFavorite)

    router.post('/list', getFavorites)

    router.post('/clear', clearFavorite)

    app.use(config.api_v1 + "/favorite", router)

}