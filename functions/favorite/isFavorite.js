'use strict';

const favorite = require('../../models/favorite');

exports.isFavorite = (user, house) => 
	
	new Promise((resolve,reject) => {

		favorite.find({user: user, house: house})

		.then(favorite => {
			if(favorite.length>0){
				resolve({status: 200, favorite: true})
			}else{
				resolve({status: 200, favorite: false})
			}
			resolve({status: 200})
		})

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});