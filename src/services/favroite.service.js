'use strict';

const favorite = require('../models/favorite');
const config = require('../config/config.json');

/**
 *
 * @param user
 * @param house
 * @returns {Promise<*>}
 */
exports.addFavorite = async function(user, house){
    const newFavorite = new favorite({

        user: user,
        house: house,
        created_at: new Date()

    });

    return await newFavorite.save();
};

/**
 *
 * @param user
 * @returns {Promise<*>}
 */
exports.clearFavorite = async function(user){
    return await favorite.deleteMany({ user: user });
};

/**
 *
 * @param house
 * @returns {Promise<void>}
 */
exports.clearFavoriteHouse = async function(house){
    return await favorite.deleteMany({ house: house });
};

/**
 *
 * @param user
 * @param house
 * @returns {Promise<boolean>}
 */
exports.isFavorite = async function(user, house){
    const favorite = await favorite.find({ user: user, house: house });
    return favorite.length > 0;
};

/**
 *
 * @param user
 * @returns {Promise<void>}
 */
exports.getFavorites = async function(user){
    return await favorite.find({ user: user })

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

        .sort({ created_at: -1 });
};

/**
 *
 * @param user
 * @param house
 * @returns {Promise<void>}
 */
exports.removeFavorite = async function(user, house){
    return await favorite.deleteOne({ user: user, house: house });
};