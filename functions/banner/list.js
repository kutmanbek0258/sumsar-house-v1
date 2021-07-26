'use strict';

const banner = require('../../models/banner');

exports.getBanners = (limit, location, radius) => 
	
	new Promise((resolve,reject) => {

        banner.find({
			location: {
				$near :{
					$maxDistance: radius,
					$geometry: location
				}
			}
		})

		.limit( limit )
		
		.sort({created_at: -1})

		.then(banners => resolve({ status: 200, banners: banners}))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});