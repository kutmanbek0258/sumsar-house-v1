'use strict';

const user = require('../../models/user');

exports.getProfile = phone => 
	
	new Promise((resolve,reject) => {

		user.find({ phone: phone }, { name: 1, phone: 1, created_at: 1, _id: 1, fast: 1 })

		.then(users => resolve(users[0]))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});