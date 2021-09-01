'use strict';

const house = require('../models/house');
const mongoose = require('mongoose');

/**
 *
 * @param address
 * @param description
 * @param location
 * @param phone
 * @param price
 * @param user
 * @param category
 * @returns {Promise<*>}
 */
exports.addHouse = async function(address, description, location, phone, price, user, category){
    const newHouse = new house({

        _id: new mongoose.Types.ObjectId(),
        address: address,
        description: description,
        phone: phone,
        price: price,
        location: location,
        user: user,
        category: category,
        created_at: new Date()

    });

    return await newHouse.save();
};

/**
 *
 * @param _id
 * @param address
 * @param description
 * @param phone
 * @param price
 * @param location
 * @param category
 * @returns {Promise<void>}
 */
exports.editHouse = async function(_id, address, description, phone, price, location, category){
    return await house.findOneAndUpdate({ _id: _id }, { address: address, description: description, phone: phone, price: price, location: location, category: category });
};

/**
 *
 * @param _id
 * @returns {Promise<void>}
 */
exports.getHouse = async function(_id){
    return await house.find({ _id: _id })

        .populate('user')

        .populate('category');
};

/**
 *
 * @param _id
 * @param user
 * @returns {Promise<boolean>}
 */
exports.isHouseUser = async function(_id, user){
    const houses = await house.find({ _id: _id, user: user });
    return houses > 0;
};

/**
 *
 * @param sort
 * @param count
 * @param limit
 * @param location
 * @param radius
 * @returns {Promise<*>}
 */
exports.getHouses = async function(sort, count, limit, location, radius){
    return await house.find({
        location: {
            $near :{
                $maxDistance: radius,
                $geometry: location
            }
        }
    })

        .select({
            description: 0,
            phone: 0,
            price: 0,
            user: 0,
            category: 0,
            created_at: 0
        })

        .skip( count )

        .limit( limit )

        .sort( sort );
};

/**
 *
 * @param sort
 * @param category
 * @param count
 * @param limit
 * @param location
 * @param radius
 * @returns {Promise<void>}
 */
exports.getHousesCategory = async function(sort, category, count, limit, location, radius){
    return await house.find({
        location: {
            $near :{
                $maxDistance: radius,
                $geometry: location
            }
        },
        category: category
    })

        .select({
            description: 0,
            phone: 0,
            price: 0,
            user: 0,
            category: 0,
            created_at: 0
        })

        .skip( count )

        .limit( limit )

        .sort( sort );
};

/**
 *
 * @param location
 * @param radius
 * @returns {Promise<void>}
 */
exports.getHousesRadius = async function(location, radius){
    return await house.find({
        location: {
            $near :{
                $maxDistance: radius,
                $geometry: location
            }
        }
    })

        .select({
            description: 0,
            phone: 0,
            price: 0,
            user: 0,
            category: 0,
            created_at: 0
        });
};

/**
 *
 * @param sort
 * @param keyword
 * @param count
 * @param limit
 * @param location
 * @param radius
 * @returns {Promise<*>}
 */
exports.getHousesKeyword = async function(sort, keyword, count, limit, location, radius){
    return await house.find({

        $text : {
            $search : keyword
        },

        location: {
            $geoWithin: {
                $centerSphere: [[
                    location.coordinates[0],
                    location.coordinates[1]
                ], radius ]
            }
        }

    })

        .select({
            description: 0,
            phone: 0,
            price: 0,
            user: 0,
            category: 0,
            created_at: 0
        })

        .skip( count )

        .limit( limit )

        .sort( sort );
};

/**
 *
 * @param user
 * @returns {Promise<*>}
 */
exports.getHousesUser = async function(user){
    return await house.find({ user: user })

        .select({
            description: 0,
            phone: 0,
            price: 0,
            user: 0,
            category: 0,
            created_at: 0
        });
};

/**
 *
 * @param id
 * @returns {Promise<void>}
 */
exports.removeHouse = async function(id){
    return await house.deleteOne({ _id: id });
};