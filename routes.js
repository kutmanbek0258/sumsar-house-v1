'use strict';

const auth = require('basic-auth');
const shortid = require('shortid');
const jwt = require('jsonwebtoken');
const passwordValidator = require('password-validator');
const config = require('./config/config.json');
const fs = require('fs');

const register = require('./functions/user/register');
const register_after = require('./functions/user/register_after');
const login = require('./functions/user/login');
const profile = require('./functions/user/profile');
const password = require('./functions/user/password');
const category_add = require('./functions/category/add');
const category_list = require('./functions/category/list');
const category_remove = require('./functions/category/remove'); 
const house_add = require('./functions/house/add');
const isHouseUser = require('./functions/house/isHouseUser');
const house_edit = require('./functions/house/edit');
const house_list = require('./functions/house/list');
const house_list_radius = require('./functions/house/list_radius');
const house_list_radius_search = require('./functions/house/list_search');
const house_list_user = require('./functions/house/list_user');
const house_list_category = require('./functions/house/list_category');
const house_remove = require('./functions/house/remove');
const history_add = require('./functions/history/add');
const history_is = require('./functions/history/isHistory');
const house_get = require('./functions/house/get');
const history_list = require('./functions/history/list');
const history_clear = require('./functions/history/clear');
const history_clear_house = require('./functions/history/clear_house');
const history_remove = require('./functions/history/remove');
const favorite_add = require('./functions/favorite/add');
const favorite_is = require('./functions/favorite/isFavorite');
const favorite_list = require('./functions/favorite/list');
const favorite_clear = require('./functions/favorite/clear');
const favorite_clear_house = require('./functions/favorite/clear_house');
const favorite_remove = require('./functions/favorite/remove');
const banner_add = require('./functions/banner/add');
const banner_remove = require('./functions/banner/remove');
const banner_list = require('./functions/banner/list');
const faq_add = require('./functions/faq/add');
const faq_get = require('./functions/faq/get');
const faq_remove = require('./functions/faq/remove');

module.exports = router => {

	router.get('/', (req, res) => res.end('Welcome to U rent !'));

	router.get('/privacy-policy', (req, res) => {
		res.render('privacy');
	});

	router.post('/authenticate', (req, res) => {

		const credentials = auth(req);

		if (!credentials) {

			res.status(400).json({ message: 'Invalid Request !' });

		} else {

			login.loginUser(credentials.name, credentials.pass)

			.then(result => {

				const token = jwt.sign(result, config.secret, { expiresIn: "365d" });
			
				res.status(result.status).json({ message: result.message, token: token });

			})

			.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});

	router.post('/users', (req, res) => {

		const name = req.body.name;
		var email = req.body.email;
		const phone = req.body.phone;
		const password = req.body.password;

		console.log(req.body);

		if (!name || !phone || !password || !name.trim() || !phone.trim() || !password.trim()) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			if(!email){
				email = phone;
			}

			if(isPasswordValid(password)){
				register.registerUser(name, email, phone, password)

				.then(result => {
	
					const token = jwt.sign(result, config.secret, { expiresIn: "365d" });
	
					res.status(result.status).json({ message: result.message, token: token });
				})
	
				.catch(err => res.status(err.status).json({ message: err.message }));
			}else{
				res.status(400).json({ message: "invalid_pass" })
			}

		}
	});

	router.post('/users_fast', (req, res) => {

		const name = req.body.name;

		if (!name || !name.trim()) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			var phone = shortid.generate();
			var email = phone;
			const password = config.default_pass;

			if(isPasswordValid(password)){
				register.registerUser(name, email, phone, password)

				.then(result => {
	
					const token = jwt.sign(result, config.secret, { expiresIn: "365d" });
	
					res.status(result.status).json({ message: result.message, token: token });
				})
	
				.catch(err => res.status(err.status).json({ message: err.message }));
			}else{
				res.status(400).json({ message: "invalid_pass" })
			}

		}
	});

	router.post('/users_after/:id', (req, res) => {

		if (checkToken(req)) {

			const _id = req.body._id;
			const phone = req.body.phone;
			const newPassword = req.body.password;

			if (!_id || !phone || !newPassword || !_id.trim() || !phone.trim() || !newPassword.trim()) {

				res.status(400).json({ message: 'Invalid Request !' });

			} else {

				if(isPasswordValid(newPassword)){
					register_after.changePassword(_id, phone, newPassword)

					.then(result => {
						const token = jwt.sign(result, config.secret, { expiresIn: "365d" });
						
						res.status(result.status).json({ message: result.message, token: token })
					})
	
					.catch(err => res.status(err.status).json({ message: err.message }));
				}else{
					res.status(400).json({ message: "invalid_pass" })
				}

			}
		} else {

			res.status(401).json({ message: 'Invalid Token !' });
		}
	});

	router.get('/users/:id', (req,res) => {

		if (checkToken(req)) {

			profile.getProfile(req.params.id)

			.then(result => res.json(result))

			.catch(err => res.status(err.status).json({ message: err.message }));

		} else {

			res.status(401).json({ message: 'Invalid Token !' });
		}
	});

	router.put('/users/:id', (req,res) => {

		if (checkToken(req)) {

			const oldPassword = req.body.password;
			const newPassword = req.body.newPassword;

			if (!oldPassword || !newPassword || !oldPassword.trim() || !newPassword.trim()) {

				res.status(400).json({ message: 'Invalid Request !' });

			} else {

				if(isPasswordValid(newPassword)){
					password.changePassword(req.params.id, oldPassword, newPassword)

					.then(result => res.status(result.status).json({ message: result.message }))
	
					.catch(err => res.status(err.status).json({ message: err.message }));
				}else{
					res.status(400).json({ message: "invalid_pass" })
				}

			}
		} else {

			res.status(401).json({ message: 'Invalid Token !' });
		}
	});

	router.post('/category_add', (req, res) => {

		const name = req.body.name;
		const description = req.body.description;

		category_add.addCategory(name, description)

		.then(result => res.status(result.status).json({message: result.message}))

		.catch(err => res.status(err.status).json({message: err.message}));
	});

	router.post('/category_list', (req, res) => {

		category_list.getCategories()

		.then(result => res.status(result.status).json({categories: result.categories}))

		.catch(err => res.status(err.status).json({message: err.message}));
	});

	router.post('/category_remove', (req, res) => {

		const _id = req.body._id;

		category_remove.removeCategory(_id)

		.then(result => res.status(result.status).json({message: result.message}))

		.catch(err => res.status(err.status).json({message: err.message}));
	});

	router.post('/house_add/:id', (req, res) => {

		if(checkToken(req)){

			const address = req.body.address;
			const description = req.body.description;
			const phone = req.body.phone;
			const price = req.body.price;
			const location = req.body.location;
			const user = req.body.user._id;
			const category = req.body.category._id;
			const image = req.body.image;
	
			if (!address || !description || !phone || !price || !location || !user || !category || !address.trim() || !description.trim() || !phone.trim() || !user.trim() || !category.trim()) {
	
				res.status(400).json({message: 'Invalid Request !'});
	
			} else{
	
				house_add.addHouse(address, description, location, phone, price, user, category)
	
				.then(result => {
	
					saveBase64Image(image, config.img_houses + result.id + "_1.png");
	
					res.status(result.status).json({message: result.message})
				})
	
				.catch(err => res.status(err.status).json({ message: err.message }));
	
			}

		}else{

			res.status(400).json({message: 'Invalid reguest !'})

		}

	});

	router.post('/house_edit/:id', (req, res) => {

		if(checkToken(req)){

			const _id = req.body._id;
			const address = req.body.address;
			const description = req.body.description;
			const phone = req.body.phone;
			const price = req.body.price;
			const location = req.body.location;
			const user = req.body.user._id;
			const category = req.body.category._id;
			const image = req.body.image;
	
			if(!_id || !address || !description || !phone || !price || !location || !category || !_id.trim() || !address.trim() || !description.trim() || !phone.trim() || !category.trim()){
	
				res.status(400).json({message: 'Invalid request !'});
	
			} else{

				isHouseUser.isHouseUser(_id, user)
				
				.then(result => {

					if(result.house == true){

						house_edit.editHouse(_id, address, description, phone, price, location, category)
	
						.then(result => {

							if(image){

								saveBase64Image(image, config.img_houses + _id + "_1.png");
								
							}
							
							res.status(result.status).json({message: result.message});
						
						})
			
						.catch(err => res.status(err.status).json({message: err.message}));

					}else{

						res.status(400).json({message: 'Invalid reguest !'})

					}
				})
	
			}

		}else{

			res.status(400).json({message: 'Invalid reguest !'})

		}

	});

	router.post('/house_get/:id', (req, res) => {

		if(checkToken(req)){

			const _id = req.body._id;
			const user = req.body.user._id;

			house_get.getHouse(_id)

			.then(resultHouse => {

				var house = resultHouse.house.toObject();

				favorite_is.isFavorite(user, _id)

				.then(result => {

					house.favorite = result.favorite;

					res.status(resultHouse.status).json(house);

					history_is.isHistory(user, _id)

					.then(result => {

						if(result.history == false){
		
							history_add.addHistory(user, _id);
		
						}
		
					})

				})
			
			})

		}else{

			res.status(400).json({message: 'Invalid reguest !'})

		}

	});

	router.post('/house_list/:id', (req, res) => {

		if(checkToken(req)){

			const count = req.body.count;
			const limit = req.body.limit;
			const location = req.body.location;
			const radius = req.body.radius;
			const sort_date = req.body.sort_date;

			if(!location){
	
				res.status(400).json({message: 'Invalid request !'});
	
			} else{

				var sort;

				if(sort_date){
					sort = {created_at: -1}
				}else{
					sort = null;
				}
	
				house_list.getHouses(sort, count, limit, location, radius)
	
				.then(result => res.status(result.status).json({houses: result.houses}))
	
				.catch(err => res.status(err.status).json({message: err.message}));
	
			}

		}else{

			res.status(400).json({message: 'Invalid reguest !'})

		}

	});

	router.post('/house_list_user/:id', (req, res) => {

		if(checkToken(req)){

			const user = req.body._id;

			if(!user){
	
				res.status(400).json({message: 'Invalid request !'});
	
			} else{
	
				house_list_user.getHouses(user)
	
				.then(result => {res.status(result.status).json({houses: result.houses})})
	
				.catch(err => res.status(err.status).json({message: err.message}));
	
			}

		}else{

			res.status(400).json({message: 'Invalid reguest !'})

		}

	});

	router.post('/house_list_radius/:id', (req, res) => {

		if(checkToken(req)){

			const location = req.body.location;
			const radius = req.body.radius;

			if(!location || !radius){
	
				res.status(400).json({message: 'Invalid request !'});
	
			} else{
	
				house_list_radius.getHouses(location, radius)
	
				.then(result => res.status(result.status).json({houses: result.houses}))
	
				.catch(err => res.status(err.status).json({message: err.message}));
	
			}

		}else{

			res.status(400).json({message: 'Invalid reguest !'})

		}

	});

	router.post('/house_list_search/:id', (req, res) => {

		if(checkToken(req)){

			const count = req.body.count;
			const limit = req.body.limit;
			const keyword = req.body.keyword;
			const location = req.body.location;
			const radius = req.body.radius;
			const sort_date = req.body.sort_date;

			if(!location){
	
				res.status(400).json({message: 'Invalid request !'});
	
			} else{

				var sort;

				if(sort_date){
					sort = {created_at: -1}
				}else{
					sort = null;
				}
	
				house_list_radius_search.getHouses(sort, keyword, count, limit, location, radius)
	
				.then(result => res.status(result.status).json({houses: result.houses}))
	
				.catch(err => res.status(err.status).json({message: err.message}));
	
			}

		}else{

			res.status(400).json({message: 'Invalid reguest !'})

		}

	});

	router.post('/house_list_category/:id', (req, res) => {

		if(checkToken(req)){

			const count = req.body.count;
			const limit = req.body.limit;
			const category = req.body.category._id;
			const location = req.body.location;
			const radius = req.body.radius;
			const sort_date = req.body.sort_date;

			if(!location){
	
				res.status(400).json({message: 'Invalid request !'});
	
			} else{

				var sort;

				if(sort_date){
					sort = {created_at: -1}
				}else{
					sort = null;
				}
	
				house_list_category.getHouses(sort, category, count, limit, location, radius)
	
				.then(result => res.status(result.status).json({houses: result.houses}))
	
				.catch(err => res.status(err.status).json({message: err.message}));
	
			}

		}else{

			res.status(400).json({message: 'Invalid reguest !'})

		}

	});

	router.post('/house_remove/:id', (req, res) => {

		
		if(checkToken(req)){

			const _id = req.body._id;
			const user = req.body.user._id;

			isHouseUser.isHouseUser(_id, user)

			.then(result => {
				if(result.house == true){

					house_remove.removeHouse(_id)
	
					.then(result => {
			
						deleteFile(config.img_houses + _id + "_1.png");
						res.status(result.status).json({message: result.message})

						history_clear_house.clearHistory(_id);

						favorite_clear_house.clearFavorite(_id);

					})
			
					.catch(err => res.status(result.status).json({message: result.message}))

				}else{

					res.status(400).json({message: 'Invalid reguest !'})

				}
			})

			

		}else{

			res.status(400).json({message: 'Invalid reguest !'})

		}

	});

	router.post('/history_add/:id', (req, res) => {

		if(checkToken(req)){

			const user = req.body.user._id;
			const house = req.body.house._id;
	
			history_is.isHistory(user, house)
	
			.then(result => {
				if(result.history == false){
	
					history_add.addHistory(user,house)
	
					.then(result => res.status(result.status).json({message: result.message}))
	
					.catch(err => res.status(err.status).json({message: err.message}));
	
				} else{
	
					res.status(result.status).json({message: 'Already in history'});
	
				}
			})
	
			.catch(err => res.status(err.status).json({message: err.message}));

		}else{

			res.status(400).json({message: 'Invalid reguest !'})

		}

	});

	router.post('/history_list/:id', (req, res) => {

		if(checkToken(req)){

			const user = req.body._id;

			history_list.getHistories(user)
	
			.then(result => res.status(result.status).json({histories: result.histories}))
	
			.catch(err => res.status(err.status).json({message: err.message}));

		}else{

			res.status(400).json({message: 'Invalid reguest !'})

		}

	});

	router.post('/history_clear/:id', (req, res) => {

		if(checkToken(req)){

			const user = req.body.user._id;

			history_clear.clearHistory(user)
	
			.then(result => res.status(result.status).json({message: result.message}))
	
			.catch(err => res.status(err.status).json({message: err.message}));

		}else{

			res.status(400).json({message: 'Invalid reguest !'})

		}

	});

	router.post('/history_remove/:id', (req, res) => {

		if(checkToken(req)){

			const user = req.body.user._id;
			const house = req.body.house._id;
	
			history_remove.removeHstory(user, house)
	
			.then(result => res.status(result.status).json({message: result.message}))
	
			.catch(err => res.status(err.status).json({message: err.message}));

		}else{

			res.status(400).json({message: 'Invalid reguest !'})

		}

	});

	router.post('/favorite/:id', (req, res) => {

		if(checkToken(req)){

			const user = req.body.user._id;
			const house = req.body.house._id;
	
			favorite_is.isFavorite(user, house)
	
			.then(result => {
	
				if(result.favorite == false){
	
					favorite_add.addFavorite(user, house)
	
					.then(result => res.status(result.status).json({message: result.message}))
			
					.catch(err => res.status(err.status).json({message: err.message}));
	
				}else{
	
					favorite_remove.removeFavorite(user, house)
	
					.then(result => res.status(result.status).json({message: result.message}))
	
					.catch(err => res.status(err.status).json({message: err.message}));
				}
	
			})
	
			.catch()

		}else{

			res.status(400).json({message: 'Invalid reguest !'})

		}
		

		
	});

	router.post('/favorite_list/:id', (req, res) => {

		if(checkToken(req)){

			const user = req.body._id;

			favorite_list.getFavorites(user)

			.then(result => res.status(result.status).json({favorites: result.favorites}))

			.catch(err => res.status(err.status).json({message: err.message}));

		}else{

			res.status(400).json({message: 'Invalid Request !'});

		}

	});

	router.post('/favorite_clear/:id', (req, res) => {

		if(checkToken(req)){

			const user = req.body.user._id;

			favorite_clear.clearFavorite(user)
	
			.then(result => res.status(result.status).json({message: result.message}))
	
			.catch(err => res.status(err.status).json({message: err.message}));

		}else{

			res.status(400).json({message: 'Invalid Request !'});

		}

		
	});

	router.post('/banner_add/:id', (req, res) => {
		const description = req.body.description;
		const link = req.body.link;
		const location = req.body.location;

		banner_add.addBanner(description, link, location)

		.then(result => res.status(result.status).json({ message: result.message }))

		.catch(err => res.status(err.status).json({ message: err.message }))

	});

	router.post('/banner_list',(req, res) => {
		
		const location = req.body;
		const limit = config.banner_limit;
		const radius = config.banner_radius;

		banner_list.getBanners(limit, location, radius)

		.then(result => res.status(result.status).json({banners: result.banners}))

		.catch(err => res.status(err.status).json({message: err.message}));
		
	});

	router.post('/faq_add/:id', (req, res) => {
		const title = req.body.title;
		const content = req.body.content;
		const contacts = req.body.contacts;
		const link = req.body.link;

		faq_add.addFAQ(title, content, contacts, link)

		.then(result => res.status(result.status).json({ message: result.message }))

		.catch(err => res.status(err.status).json({ message: err.message }))

	});

	router.post('/faq',(req, res) => {

		faq_get.getFAQ()

		.then(result => res.status(result.status).json(result.faq))

		.catch(err => res.status(err.status).json({message: err.message}));
		
	});

	function checkToken(req) {

		const token = req.headers['x-access-token'];

		if (token) {

			try {

  				var decoded = jwt.verify(token, config.secret);

  				return decoded.message === req.params.id;

			} catch(err) {

				return false;
			}

		} else {

			return false;
		}
	}

	function isPasswordValid(password) {

		var schema = new passwordValidator();

		schema
		.is().min(8)                                    // Minimum length 8
		.is().max(100)                                  // Maximum length 100
		.has().lowercase()                              // Must have lowercase letters
		.has().digits()                                 // Must have digits
		.has().not().spaces()                           // Should not have spaces
		.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

		return schema.validate(password);
	}

	function saveBase64Image(base64Data, fileName){
		fs.writeFile(fileName, base64Data, 'base64', function(err) {
			if (err) {
				return false;
			}
			return true;
		});
	}

	function deleteFile(fileName){
		fs.unlink(fileName,function(err) {
			if (err) {
				return false;
			}
			return true;
		});
	}
}