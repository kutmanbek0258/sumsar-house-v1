'use strict';

const faq = require('../../models/faq');

exports.addFAQ = (title, content, contacts, link) =>

	new Promise((resolve,reject) => {

		const newFAQ = new faq({

			title: title,
			content: content,
			contacts: contacts,
			link: link,
            created_at: new Date()
            
		});

		newFAQ.save()

		.then(() => resolve({status: 200, message: title}))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));
	});