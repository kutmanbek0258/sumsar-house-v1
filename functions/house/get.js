'use strict';

const house = require('../../models/house');

exports.getHouse = _id => 
	
	new Promise((resolve,reject) => {

		house.find({ _id: _id })

		.populate('user')

		.populate('category')

		.then(houses => resolve({ status: 200, house: houses[0]}))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});