'use strict';

const faq = require('../../models/faq');

exports.removeFAQ = id => 
	
	new Promise((resolve,reject) => {

		faq.deleteOne({ _id: id })

		.then(() => resolve({ status: 200,  message: 'Success deleted !' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});