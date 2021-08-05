'use strict'
const express = require("express");
const router = express.Router();
const config = require("../config/config.json");

const { jwtMiddleware: {
    verifyToken
} } = require("../helpers")

const { historyController: {
    addHistory,
    historyClear,
    historyList,
    historyRemove
}} = require("../controllers")

module.exports = app => {

    router.post('/add/:id', verifyToken, addHistory);

    router.post('/list/:id', verifyToken, historyList);

    router.post('/clear/:id', verifyToken, historyClear);

    router.post('/remove/:id', verifyToken, historyRemove);

    app.use(config.api_v1 + "/history", router)

}