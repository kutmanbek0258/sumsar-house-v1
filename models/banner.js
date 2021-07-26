'use strict';

const mongoose = require('mongoose');

const bannerSchema = mongoose.Schema({ 

	description     : {type: String, unique: true},
	link            : String,
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
	created_at		: Date
	
});

bannerSchema.index({location: "2dsphere"});

module.exports = mongoose.model('banner', bannerSchema);        