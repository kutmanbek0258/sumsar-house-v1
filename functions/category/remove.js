'use strict';

const category = require('../../models/category');

exports.removeCategory = (_id) => 
	
	new Promise((resolve,reject) => {

		category.deleteOne({ _id: _id })

		.then(() => resolve({ status: 200,  message: 'Success deleted !' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});