'use strict';

const mongoose = require('mongoose');

const faqSchema = mongoose.Schema({

    title           : String,
    content         : String,
    contacts        : String,
    link            : String,
    created_at		: Date

});

module.exports = mongoose.model('faq', faqSchema);