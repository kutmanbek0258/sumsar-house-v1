'use strict';

const favorite = require('../../models/favorite');

exports.clearFavorite = (user) => 
	
	new Promise((resolve,reject) => {

		favorite.deleteMany({ user: user })

		.then(() => resolve({ status: 200,  message: 'Success deleted !' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});