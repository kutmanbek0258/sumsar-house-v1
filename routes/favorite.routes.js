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

    router.post('/favorite/:id', addFavorite)

    router.post('/favorite_list/:id', getFavorites)

    router.post('/favorite_clear/:id', clearFavorite)

    app.use(config.api_v1, router)

}