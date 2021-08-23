'use strict';
const express = require('express');
const router = express.Router();
const config = require('../config/config.json');

const { jwtMiddleware: {
    verifyToken
} } = require('../helpers');

const { categoryController: {
    addCategory,
    getCategories,
    removeCategory
} } = require('../controllers');

module.exports = app => {
    router.post('/add/:id', verifyToken, addCategory);

    router.post('/list/:id', verifyToken, getCategories);

    router.post('/remove/:id', verifyToken, removeCategory);

    app.use(config.api_v1 + '/category', router);

};