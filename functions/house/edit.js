'use strict';

const house = require('../../models/house');

exports.editHouse = (_id, address, description, phone, price, location, category) => 

	new Promise((resolve, reject) => {

		house.findOneAndUpdate({ _id: _id }, {address: address, description: description, phone: phone, price: price, location: location, category: category})

		.then(resolve({ status: 200, message: 'House Updated Sucessfully !' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

	});