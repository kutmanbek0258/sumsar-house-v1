'use strict';

const house = require('../../models/house');

exports.removeHouse = id => 
	
	new Promise((resolve,reject) => {

		house.deleteOne({ _id: id })

		.then(() => resolve({ status: 200,  message: 'Success deleted !' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});