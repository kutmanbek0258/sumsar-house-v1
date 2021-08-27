'use strict';

const history = require('../models/history');

/**
 *
 * @param user
 * @param house
 * @returns {Promise<*>}
 */
exports.addHistory = async function(user, house){
    const newHistory = new history({

        user: user,
        house: house,
        created_at: new Date()

    });

    return await newHistory.save();
};

/**
 *
 * @param user
 * @returns {Promise<*>}
 */
exports.clearHistory = async function(user){
    return await history.deleteMany({ user: user });
};

/**
 *
 * @param house
 * @returns {Promise<*>}
 */
exports.clearHistoryHouse = async function(house){
    return await history.deleteMany({ house: house });
};

/**
 *
 * @param user
 * @param house
 * @returns {Promise<*>}
 */
exports.isHistory = async function(user, house){
    return await history.find({ user: user, house: house });
};

/**
 *
 * @param user
 * @returns {Promise<*>}
 */
exports.getHistories = async function(user){
    return await history.find({ user: user });
};

/**
 *
 * @param user
 * @param house
 * @returns {Promise<*>}
 */
exports.removeHistory = async function(user, house){
    return await history.deleteOne({ user: user, house: house });
};