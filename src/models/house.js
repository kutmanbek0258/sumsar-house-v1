'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const houseSchema = mongoose.Schema({ 

	address         : String,
	description     : String,
	phone           : String,
	price           : Number,
	location: {
		type: {
			type: String,
			default: ['Point'],
			required: true,
		},
		coordinates: {
			type: [Number],
			required: true
		}
	},
	user			: {type: Schema.Types.ObjectId, ref: 'user'},
	category        : {type: Schema.Types.ObjectId, ref: 'category'},
	created_at		: Date
	
});

houseSchema.index({location: "2dsphere"});
houseSchema.index({address: "text", description: "text"}, { default_language: "russian" });

module.exports = mongoose.model('house', houseSchema);        