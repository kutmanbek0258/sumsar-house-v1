'use strict';

const history = require('../../models/history');

exports.isHistory = (user, house) => 
	
	new Promise((resolve,reject) => {

		history.find({user: user, house: house})

		.then(history => {
			if(history.length>0){
				resolve({status: 200, history: true})
			}else{
				resolve({status: 200, history: false})
			}
			resolve({status: 200})
		})

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});