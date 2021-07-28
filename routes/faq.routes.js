'use strict'
const express = require("express");
const router = express.Router();
const config = require("./../config/config");

const { faqController: {
    addFAQ,
    getFAQ,
    removeFAQ
}} = require("./../controllers")

module.exports = app => {
    router.post('/add', addFAQ)

    router.post('/faq', getFAQ)

    router.post('/remove', removeFAQ)

    app.use(config.api_v1 + "/faq", router)

}