'use strict';

const house = require('../../models/house');

exports.getHouses = (user) => 
	
	new Promise((resolve,reject) => {

        house.find({user: user})
        
		.select({
			description: 0,
			phone: 0, 
			price: 0,
			user: 0,
			category: 0,
			created_at: 0
		})

		.then(houses => resolve({ status: 200, houses: houses}))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});