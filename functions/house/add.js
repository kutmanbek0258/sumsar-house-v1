'use strict';

const house = require('../../models/house');
const mongoose = require('mongoose');

exports.addHouse = (address, description, location, phone, price, user, category) =>

	new Promise((resolve,reject) => {

		const newHouse = new house({

			_id: new mongoose.Types.ObjectId(),
			address: address,
			description: description,
			phone: phone,
			price: price,
            location: location,
			user: user,
			category: category,
            created_at: new Date()
            
		});

		newHouse.save()

		.then(() => resolve({status: 200, message: address , id: newHouse._id}))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));
	});