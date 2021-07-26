'use strict';

const faq = require('../../models/faq');

exports.getFAQ = () => 
	
	new Promise((resolve,reject) => {

        faq.findOne()

		.then(faq => resolve({ status: 200, faq: faq}))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});