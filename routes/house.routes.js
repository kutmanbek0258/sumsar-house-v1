'use strict'
const express = require("express");
const router = express.Router();

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
    router.post('/house_add/:id', addHouse)

    router.post('/house_edit/:id', editHouse)

    router.post('/house_get/:id', getHouse)

    router.post('/house_list/:id', getHouses)

    router.post('/house_list_user/:id', getHousesUser)

    router.post('/house_list_radius/:id', getHousesRadius)

    router.post('/house_list_search/:id', getHousesSearch)

    router.post('/house_list_category/:id', getHousesCategory)

    router.post('/house_remove/:id', removeHouse)

    app.use(router)
}