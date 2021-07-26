'use strict';

const banner = require('../../models/banner');

exports.addBanner = (description, link, location) =>

	new Promise((resolve,reject) => {

		const newBanner = new banner({

			description: description,
			link: link,
            location: location,
            created_at: new Date()
            
		});

		newBanner.save()

		.then(() => resolve({status: 200, message: description}))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));
	});