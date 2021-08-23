'use strict';

const mongoose = require('mongoose');

const category = mongoose.Schema({

    name            : String,
    description     : String,
    created_at		: Date

});

module.exports = mongoose.model('category', category);