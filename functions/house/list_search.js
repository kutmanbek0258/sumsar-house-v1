'use strict';

const house = require('../../models/house');

exports.getHouses = (sort, keyword, count, limit, location, radius) => 
	
	new Promise((resolve,reject) => {

        house.find({

			$text : {
				$search : keyword
			},

			location: {
				$geoWithin: {
					$centerSphere: [[
					   location.coordinates[0],
					   location.coordinates[1]
					], radius ]
				}
			}

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

		.catch(err => {
			console.log(err.message)
			reject({ status: 500, message: 'Internal Server Error !' })
		})

	});