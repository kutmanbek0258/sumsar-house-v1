'use strict'
const express = require("express");
const router = express.Router();

const { faqController: {
    addFAQ,
    getFAQ,
    removeFAQ
}} = require("./../controllers")

module.exports = app => {
    router.post('/faq_add/:id', addFAQ)

    router.post('/faq', getFAQ)

    router.post('/remove_faq/:id', removeFAQ)

    app.use(router)
}