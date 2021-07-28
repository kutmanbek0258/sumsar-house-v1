'use strict'
const express = require("express");
const router = express.Router();
const config = require("./../config/config");

const { jwtMiddleware: {
    verifyToken
} } = require("./../helpers")

const { favoriteController: {
    addFavorite,
    getFavorites,
    clearFavorite
} } = require("./../controllers")

module.exports = app => {

    router.post('/add/:id', verifyToken, addFavorite)

    router.post('/list/:id', verifyToken, getFavorites)

    router.post('/clear/:id', verifyToken, clearFavorite)

    app.use(config.api_v1 + "/favorite", router)

}