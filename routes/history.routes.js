'use strict'
const express = require("express");
const router = express.Router();
const config = require("./../config/config");

const { historyController: {
    addHistory,
    historyClear,
    historyList,
    historyRemove
}} = require("./../controllers")

module.exports = app => {

    router.post('/add', addHistory);

    router.post('/list', historyList);

    router.post('/clear', historyClear);

    router.post('/remove', historyRemove);

    app.use(config.api_v1 + "/history", router)

}