'use strict';

const history = require('../../models/history');

exports.addHistory = (user, house) =>

	new Promise((resolve,reject) => {

		const newHistory = new history({

			user: user,
			house: house,
			created_at: new Date()
            
		});

		newHistory.save()

		.then(() => resolve({ status: 200, message: 'Added to hostory' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

	});