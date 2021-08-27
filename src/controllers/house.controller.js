'use strict';

const config = require('../config/config.json');

const { houseService: {
    addHouse,
    editHouse,
    getHouse,
    getHouses,
    isHouseUser,
    getHousesCategory,
    getHousesKeyword,
    removeHouse,
    getHousesRadius,
    getHousesUser
}, favoriteService: {
    isFavorite,
    clearFavorite
}, historyService: {
    isHistory,
    addHistory,
    clearHistory
} } = require('../services');

const { files: {
    saveBase64Image,
    deleteFile
} } = require('../helpers');

const { apiHelper: { createPayload, createStatus } } = require('../helpers');

exports.addHouse = async function (req, res) {

    const {
        address,
        description,
        phone,
        price,
        location,
        user: { _id: userId },
        category,
        image
    } = req.body;
    let house = null;

    if (!address || !description || !phone || !price || !location || !userId || !category || !address.trim() || !description.trim() || !phone.trim() || !userId.trim() || !category.trim()) {
        res.status(createStatus('e_invalid_request')).json(createPayload('e_invalid_request'));
        return;
    }

    try{
        house = await addHouse(address, description, location, phone, price, userId, category);
    }catch (error){
        res.status(createStatus('e_server_error')).json(createPayload('e_server_error'));
        return;
    }

    try{
        saveBase64Image(image, config.img_houses + house[0].id + '_1.png');
    }catch (error){
        res.status(createStatus('e_server_error')).json(createPayload('e_server_error'));
        return;
    }

    res.status(createStatus('success')).json(createPayload('success'));

};

exports.editHouse = async function (req, res){

    const {
        _id,
        address,
        description,
        phone,
        price,
        location,
        user: { _id: userId },
        category,
        image
    } = req.body;

    if(!_id || !address || !description || !phone || !price || !location || !category || !_id.trim() || !address.trim() || !description.trim() || !phone.trim() || !category._id.trim()){
        res.status(createStatus('e_invalid_request')).json(createPayload('e_invalid_request'));
        return;
    }

    try{
        if(!await isHouseUser(_id, userId)){
            res.status(createStatus('e_access_denied')).json(createPayload('e_access_denied'));
            return;
        }
    }catch (error){
        res.status(createStatus('e_server_error')).json(createPayload('e_server_error'));
        return;
    }

    if(image){
        try{
            saveBase64Image(image, config.img_houses + _id + '_1.png');
        }catch (error){
            res.status(createStatus('e_server_error')).json(createPayload('e_server_error'));
            return;
        }
    }

    try{
        await editHouse(_id, address, description, phone, price, location, category);
    }catch (error){
        res.status(createStatus('e_server_error')).json(createPayload('e_server_error'));
        return;
    }

    res.status(createStatus('success')).json(createPayload('success'));

};

exports.getHouse = async function (req, res) {

    const {
        _id,
        user: { _id: userId }
    } = req.body;
    let house = null;

    try{
        const houses = await getHouse(_id);
        house = houses[0];
    }catch (error){
        res.status(createStatus('e_server_error')).json(createPayload('e_server_error'));
        return;
    }

    try{
        if(await isFavorite(userId, _id)){
            house.favorite = true;
        }
    }catch (error){
        res.status(createStatus('e_server_error')).json(createPayload('e_server_error'));
        return;
    }

    try{
        if(!await isHistory(userId, _id)){
            await addHistory(userId, _id);
        }
    }catch (error){
        res.status(createStatus('e_server_error')).json(createPayload('e_server_error'));
        return;
    }

    res.status(createStatus('success')).json(createPayload('success', { house: house }));

};

exports.getHouses = async function (req, res) {

    const {
        count,
        limit,
        location,
        radius,
        sort_date
    } = req.body;
    let houses = null;

    if(!location){
        res.status(createStatus('e_invalid_request')).json(createPayload('e_invalid_request'));
        return;
    }

    try{
        let sort;

        if(sort_date){
            sort = { created_at: -1 };
        }else{
            sort = null;
        }

        houses = await getHouses(sort, count, limit, location, radius);
    }catch (error){
        res.status(createStatus('e_server_error')).json(createPayload('e_server_error'));
        return;
    }

    res.status(createStatus('success')).json(createPayload('success', { houses: houses }));
};

exports.getHousesUser = async function (req, res) {

    const {
        user
    } = req.body;

    if(!user){

        res.status(400).json({ message: 'Invalid request !' });

    } else{

        await getHousesUser(user._id, result => {
            res.status(result.status).json({ houses: result.houses });
        }, err => {
            res.status(err.status).json({ message: err.message });
        });

    }

};

exports.getHousesRadius = async function (req, res) {

    const {
        location,
        radius
    } = req.body;

    if(!location || !radius){

        res.status(400).json({ message: 'Invalid request !' });

    } else{

        await getHousesRadius(location, radius, result => {
            res.status(result.status).json({ houses: result.houses });
        }, err => {
            res.status(err.status).json({ message: err.message });
        });

    }

};

exports.getHousesSearch = async function (req, res) {

    const {
        count,
        limit,
        keyword,
        location,
        radius,
        sort_date
    } = req.body;

    if(!location){

        res.status(400).json({ message: 'Invalid request !' });

    } else{

        let sort;

        if(sort_date){
            sort = { created_at: -1 };
        }else{
            sort = null;
        }

        await getHousesKeyword(sort, keyword, count, limit, location, radius, result => {
            res.status(result.status).json({ houses: result.houses });
        }, err => {
            res.status(err.status).json({ message: err.message });
        });

    }

};

exports.getHousesCategory = async function (req, res) {

    const {
        count,
        limit,
        category,
        location,
        radius,
        sort_date
    } = req.body;

    if(!location){

        res.status(400).json({ message: 'Invalid request !' });

    } else{

        let sort;

        if(sort_date){
            sort = { created_at: -1 };
        }else{
            sort = null;
        }

        await getHousesCategory(sort, category, count, limit, location, radius, result => {
            res.status(result.status).json({ houses: result.houses });
        }, err => res.status(err.status).json({ message: err.message }));

    }

};

exports.removeHouse = async function (req, res) {

    const {
        _id,
        user
    } = req.body;

    await isHouseUser(_id, user._id, result => {
        if(result.house === true){

            removeHouse(_id, result => {
                deleteFile(config.img_houses + _id + '_1.png');
                res.status(result.status).json({ message: result.message });

                clearHistory(_id);

                clearFavorite(_id);
            }, () => {
                res.status(result.status).json({ message: result.message });
            });

        }else{

            res.status(400).json({ message: 'Invalid request !' });

        }
    }, () => res.status(400).json({ message: 'Internal error !' }));

};