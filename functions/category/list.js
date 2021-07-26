'use strict';

const category = require('../../models/category');

exports.getCategories = () => 
	
	new Promise((resolve,reject) => {

		category.find()

		.then(categories => resolve({ status: 200, categories: categories}))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});