'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoruteSchema = mongoose.Schema({

	user 		    : {type: Schema.Types.ObjectId, ref: 'user'},
	house           : {type: Schema.Types.ObjectId, ref: 'house'},
	created_at		: Date
	
});

module.exports = mongoose.model('favorite', favoruteSchema);