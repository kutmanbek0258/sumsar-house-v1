'use strict';

const user = require('../../models/user');
const config = require('../../config/config');
const bcrypt = require('bcryptjs');

exports.changePassword = (_id, phone, newPassword) => 

	new Promise((resolve, reject) => {

		user.find({ _id: _id })

		.then(users => {

			var password = config.default_pass;

			let user = users[0];
			const hashed_password = user.hashed_password;

			if (bcrypt.compareSync(password, hashed_password)) {

				const salt = bcrypt.genSaltSync(10);
				const hash = bcrypt.hashSync(newPassword, salt);

				user.phone = phone;
				user.email = phone;
				user.fast = false;
				user.hashed_password = hash;

				return user.save();

			} else {

				reject({ status: 401, message: 'Invalid Old Password !' });
			}
		})

		.then(user => resolve({ status: 200, message: phone }))

		.catch(err => reject({ status: 500, message: 'User existed !' }));

	});