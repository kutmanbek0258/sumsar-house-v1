'use strict';
const express = require('express');
const router = express.Router();
const config = require('../config/config.json');

const { jwtMiddleware: {
    verifyToken
} } = require('../helpers');

const { houseController: {
    addHouse,
    getHousesUser,
    getHousesRadius,
    removeHouse,
    getHouse,
    getHousesCategory,
    getHouses,
    editHouse,
    getHousesSearch
} } = require('../controllers');

module.exports = app => {
    router.post('/add/:id', verifyToken, addHouse);

    router.post('/edit/:id', verifyToken, editHouse);

    router.post('/get/:id', verifyToken, getHouse);

    router.post('/list/:id', verifyToken, getHouses);

    router.post('/list_user/:id', verifyToken, getHousesUser);

    router.post('/list_radius/:id', verifyToken, getHousesRadius);

    router.post('/list_keyword/:id', verifyToken, getHousesSearch);

    router.post('/list_category/:id', verifyToken, getHousesCategory);

    router.post('/remove/:id', verifyToken, removeHouse);

    app.use(config.api_v1 + '/house', router);
};