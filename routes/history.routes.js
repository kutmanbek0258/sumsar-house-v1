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

    router.post('/history_add/:id', addHistory);

    router.post('/history_list/:id', historyList);

    router.post('/history_clear/:id', historyClear);

    router.post('/history_remove/:id', historyRemove);

    app.use(router)
    app.use(config.api_v1, router)

}