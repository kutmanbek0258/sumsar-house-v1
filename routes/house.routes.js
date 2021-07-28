'use strict'
const express = require("express");
const router = express.Router();
const config = require("./../config/config");

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
} } = require("./../controllers")

module.exports = app => {
    router.post('/add', addHouse)

    router.post('/edit', editHouse)

    router.post('/get', getHouse)

    router.post('/list', getHouses)

    router.post('/list_user', getHousesUser)

    router.post('/list_radius', getHousesRadius)

    router.post('/list_keyword', getHousesSearch)

    router.post('/list_category', getHousesCategory)

    router.post('/remove', removeHouse)

    app.use(config.api_v1 + "/house", router)
}