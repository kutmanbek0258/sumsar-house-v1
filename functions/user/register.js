'use strict';

const user = require('../../models/user');
const bcrypt = require('bcryptjs');

exports.registerUser = (name, email, phone, password) => 

	new Promise((resolve,reject) => {

	    const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(password, salt);

		const newUser = new user({

			name: name,
			email: email,
			phone: phone,
			fast: true,
			hashed_password: hash,
			created_at: new Date()
		});

		newUser.save()

		.then(() => resolve({ status: 200, message: phone }))

		.catch(err => {

			if (err.code == 11000) {

				console.log(err);
						
				reject({ status: 409, message: 'User Already Registered !' });

			} else {

				reject({ status: 500, message: 'Internal Server Error !' });
			}
		});
	});


