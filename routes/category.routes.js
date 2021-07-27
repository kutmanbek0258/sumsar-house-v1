'use strict'
const express = require("express");
const router = express.Router();

const { categoryController: {
    addCategory,
    getCategories,
    removeCategory
} } = require("./../controllers")

module.exports = app => {
    router.post('/category_add', addCategory);

    router.post('/category_list', getCategories);

    router.post('/category_remove', removeCategory);

    app.use(router)
}