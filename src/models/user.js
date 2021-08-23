'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    name 			: String,
    email           : { type: String, unique: true },
    phone			: { type: String, unique: true },
    fast            : Boolean,
    hashed_password	: String,
    created_at		: Date,
    temp_password	: String,
    temp_password_time: Date

});

module.exports = mongoose.model('user', userSchema);