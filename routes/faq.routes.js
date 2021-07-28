'use strict'
const express = require("express");
const router = express.Router();
const config = require("./../config/config");

const { jwtMiddleware: {
    verifyToken
} } = require("./../helpers")

const { faqController: {
    addFAQ,
    getFAQ,
    removeFAQ
}} = require("./../controllers")

module.exports = app => {
    router.post('/add/:id', verifyToken, addFAQ)

    router.post('/faq', getFAQ)

    router.post('/remove/:id', verifyToken, removeFAQ)

    app.use(config.api_v1 + "/faq", router)

}