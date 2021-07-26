'use strict';

const history = require('../../models/history');

exports.clearHistory = (house) => 
	
	new Promise((resolve,reject) => {

		history.deleteMany({ house: house })

		.then(() => resolve({ status: 200,  message: 'Success cleared !' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});