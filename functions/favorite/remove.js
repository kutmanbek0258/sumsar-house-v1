'use strict';

const favorite = require('../../models/favorite');

exports.removeFavorite = (user, house) => 
	
	new Promise((resolve,reject) => {

		favorite.deleteOne({ user: user, house: house })

		.then(favorites => resolve({ status: 200,  message: 'Success deleted !' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});