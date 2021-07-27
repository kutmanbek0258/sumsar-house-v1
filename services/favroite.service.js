'use strict';

const favorite = require('../models/favorite');
const config = require('../config/config.json');

exports.addFavorite = async function(user, house, callback){
    const newFavorite = new favorite({

        user: user,
        house: house,
        created_at: new Date()

    });

    await newFavorite.save()

        .then(() => callback({ status: 200, message: 'Added to favorites' }))

        .catch(err => callback({ status: 500, message: 'Internal Server Error !' }));
}

exports.clearFavorite = async function(user, callback){
    await favorite.deleteMany({ user: user })

        .then(() => callback({ status: 200,  message: 'Success deleted !' }))

        .catch(err => callback({ status: 500, message: 'Internal Server Error !' }))
}

exports.clearFavoriteHouse = async function(house, callback){
    favorite.deleteMany({ house: house })

        .then(() => callback({ status: 200,  message: 'Success deleted !' }))

        .catch(err => callback({ status: 500, message: 'Internal Server Error !' }))
}

exports.isFavorite = async function(user, house, callback){
    await favorite.find({user: user, house: house})

        .then(favorite => {
            if(favorite.length>0){
                callback({status: 200, favorite: true})
            }else{
                callback({status: 200, favorite: false})
            }
            callback({status: 200})
        })

        .catch(err => callback({ status: 500, message: 'Internal Server Error !' }))
}

exports.getFavorites = async function(user, callback){
    await favorite.find({ user: user })

        .populate('user')

        .populate({
            path: 'house',
            select : {
                description: 0,
                phone: 0,
                price: 0,
                user: 0,
                category: 0,
                created_at: 0
            }
        })

        .limit(config.favorite_limit)

        .sort({created_at: -1})

        .then(favorites => callback({ status: 200, favorites: favorites}))

        .catch(err => callback({ status: 500, message: 'Internal Server Error !' }))
}

exports.removeFavorite = async function(user, house, callback){
    await favorite.deleteOne({ user: user, house: house })

        .then(favorites => callback({ status: 200,  message: 'Success deleted !' }))

        .catch(err => callback({ status: 500, message: 'Internal Server Error !' }))
}