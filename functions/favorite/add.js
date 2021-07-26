'use strict';

const favorite = require('../../models/favorite');

exports.addFavorite = (user, house) =>

	new Promise((resolve,reject) => {

		const newFavorite = new favorite({

			user: user,
			house: house,
            created_at: new Date()
            
		});

		newFavorite.save()

		.then(() => resolve({ status: 200, message: 'Added to favorites' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

	});


