'use strict';

const house = require('../../models/house');

exports.getHouses = (sort, category, count, limit, location, radius) => 
	
	new Promise((resolve,reject) => {

        house.find({
			location: {
				$near :{
					$maxDistance: radius,
					$geometry: location
				}
			},
			category: category
		})
        
		.select({
			description: 0,
			phone: 0, 
			price: 0,
			user: 0,
			category: 0,
			created_at: 0
		})

		.skip( count )

		.limit( limit )

		.sort( sort )

		.then(houses => resolve({ status: 200, houses: houses}))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});