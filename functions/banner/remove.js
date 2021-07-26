'use strict';

const banner = require('../../models/banner');

exports.removeBanner = id => 
	
	new Promise((resolve,reject) => {

		banner.deleteOne({ _id: id })

		.then(() => resolve({ status: 200,  message: 'Success deleted !' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});