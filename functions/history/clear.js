'use strict';

const history = require('../../models/history');

exports.clearHistory = (user) => 
	
	new Promise((resolve,reject) => {

		history.deleteMany({ user: user })

		.then(() => resolve({ status: 200,  message: 'Success cleared !' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});