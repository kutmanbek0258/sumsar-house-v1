'use strict'
const express = require("express");
const router = express.Router();
const config = require("./../config/config");

const { categoryController: {
    addCategory,
    getCategories,
    removeCategory
} } = require("./../controllers")

module.exports = app => {
    router.post('/add', addCategory);

    router.post('/list', getCategories);

    router.post('/remove', removeCategory);

    app.use(config.api_v1 + "/category", router)

}