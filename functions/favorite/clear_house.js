'use strict';

const favorite = require('../../models/favorite');

exports.clearFavorite = (house) => 
	
	new Promise((resolve,reject) => {

		favorite.deleteMany({ house: house })

		.then(() => resolve({ status: 200,  message: 'Success deleted !' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});