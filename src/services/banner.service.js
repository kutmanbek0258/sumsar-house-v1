'use strict';

const banner = require('../models/banner');

/**
 *
 * @param description
 * @param link
 * @param location
 * @param callback
 * @param error
 * @returns {Promise<void>}
 */
exports.addBanner = async function(description, link, location, callback, error){
    const newBanner = new banner({

        description: description,
        link: link,
        location: location,
        created_at: new Date()

    });

    await newBanner.save()

        .then(() => callback({ status: 200, message: 'added success' }))

        .catch(() => error({ status: 500, message: 'Internal Server Error !' }));
};

/**
 *
 * @param limit
 * @param location
 * @param radius
 * @param callback
 * @param error
 * @returns {Promise<void>}
 */
exports.getBanners = async function(limit, location, radius, callback, error){
    await banner.find({
        location: {
            $near :{
                $maxDistance: radius,
                $geometry: location
            }
        }
    })

        .limit( limit )

        .sort({ created_at: -1 })

        .then(banners => callback({ status: 200, banners: banners }))

        .catch(() => error({ status: 500, message: 'Internal Server Error !' }));
};

/**
 *
 * @param id
 * @param callback
 * @param error
 * @returns {Promise<void>}
 */
exports.removeBanner = async function(id, callback, error){
    await banner.deleteOne({ _id: id })

        .then(() => callback({ status: 200, message: 'Success deleted !' }))

        .catch(() => error({ status: 500, message: 'Internal Server Error !' }));
};