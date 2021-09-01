'use strict';

const banner = require('../models/banner');

/**
 *
 * @param description
 * @param link
 * @param location
 * @returns {Promise<*>}
 */
exports.addBanner = async function(description, link, location){
    const newBanner = new banner({

        description: description,
        link: link,
        location: location,
        created_at: new Date()

    });

    return await newBanner.save();
};

/**
 *
 * @param limit
 * @param location
 * @param radius
 * @returns {Promise<*>}
 */
exports.getBanners = async function(limit, location, radius){
    return await banner.find({
        location: {
            $near :{
                $maxDistance: radius,
                $geometry: location
            }
        }
    })

        .limit( limit )

        .sort({ created_at: -1 });
};

/**
 *
 * @param id
 * @returns {Promise<*>}
 */
exports.removeBanner = async function(id){
    return await banner.deleteOne({ _id: id });
};