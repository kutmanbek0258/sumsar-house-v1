'use strict';

const history = require('../../models/history');

exports.removeHstory = (user, house) => 
	
	new Promise((resolve,reject) => {

		history.deleteOne({ user: user, house: house })

		.then(history => resolve({ status: 200,  message: 'Success deleted !' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});