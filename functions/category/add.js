'use strict';

const category = require('../../models/category');

exports.addCategory = (name, description) =>

	new Promise((resolve,reject) => {

		const newCategory = new category({

			name: name,
			description: description,
            created_at: new Date()
            
		});

		newCategory.save()

		.then(() => resolve({ status: 200, message: 'Added to categories' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

	});


