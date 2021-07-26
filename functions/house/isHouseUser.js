'use strict';

const house = require('../../models/house');

exports.isHouseUser = (_id, user) => 
	
	new Promise((resolve,reject) => {

		house.find({_id: _id, user: user})

		.then(houses => {
			if(houses.length>0){
				resolve({status: 200, house: true})
			}else{
				resolve({status: 200, house: false})
			}
		})

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});