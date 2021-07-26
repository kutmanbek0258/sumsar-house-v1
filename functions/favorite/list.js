'use strict';

const favorite = require('../../models/favorite');
const config = require('../../config/config.json');

exports.getFavorites = user => 
	
	new Promise((resolve,reject) => {

		favorite.find({ user: user })

		.populate('user')

		.populate({
			path: 'house',
			select : {
				description: 0,
				phone: 0, 
				price: 0,
				user: 0,
				category: 0,
				created_at: 0
			}
		})

		.limit(config.favorite_limit)

		.sort({created_at: -1})

		.then(favorites => resolve({ status: 200, favorites: favorites}))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});