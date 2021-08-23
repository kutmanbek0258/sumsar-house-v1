const express = require('express');
const router = express.Router();
const config = require('../config/config.json');

module.exports = app => {

    router.get('/', (req, res) => res.end('Welcome to U rent !'));

    router.get('/privacy-policy', (req, res) => {
        res.render('privacy');
    });

    app.use(config.api_v1, router);

};