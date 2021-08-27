'use strict';

const config = require('../config/config.json');

const { bannerService: {
    addBanner,
    getBanners,
    removeBanner
} } = require('../services');

exports.addBanner = async function (req, res) {

    const { description, link, location } = req.body;

    try {
        await addBanner(description, link, location);
    }catch (error){
        res.status(500).json({ error: true, message: 'Server Error' });
        return;
    }

    res.status(200).json({ error: false, message: 'Created Success' });

};

exports.getBanners = async function (req, res) {

    const { location } = req.body;
    const limit = config.banner_limit;
    const radius = config.banner_radius;

    let banners = null;

    try{
        banners = await getBanners(limit, location, radius);
    }catch (error){
        res.status(500).json({ error: true, message: 'Server Error' });
        return;
    }

    res.status(200).json({ banners: banners });

};

exports.removeBanner = async function (req, res) {
    const { _id } = req.body;

    try{
        await removeBanner(_id);
    }catch (error){
        res.status(500).json({ error: true, message: 'Server error' });
        return;
    }

    res.status(200).json({ error: false, message: 'Deleted success' });
};