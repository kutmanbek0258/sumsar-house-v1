'use strict';

const history = require('../../models/history');
const config = require('../../config/config.json');

exports.getHistories = user => 
	
	new Promise((resolve,reject) => {

		history.find({ user: user })

		.populate('user')

		.populate({
			path: 'house',
			select : {
				description: 0,
				phone: 0, 
				price: 0,
				user: 0,
				category: 0,
				created_at: 0
			}
		})

		.limit(config.history_limit)

		.sort({created_at: -1})

		.then(histories => resolve({ status: 200, histories: histories}))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});