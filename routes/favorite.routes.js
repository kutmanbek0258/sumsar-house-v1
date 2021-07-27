'use strict'
const express = require("express");
const router = express.Router();

const { favoriteController: {
    addFavorite,
    getFavorites,
    clearFavorite
} } = require("./../controllers")

module.exports = app => {

    router.post('/favorite/:id', addFavorite)

    router.post('/favorite_list/:id', getFavorites)

    router.post('/favorite_clear/:id', clearFavorite)

    app.use(router)

}