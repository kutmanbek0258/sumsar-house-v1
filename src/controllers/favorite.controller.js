'use strict';

const { favoriteService: {
    addFavorite,
    clearFavorite,
    isFavorite,
    removeFavorite,
    getFavorites
} } = require('../services');

const { apiHelper: { createStatus, createPayload } } = require('../helpers');


exports.addFavorite = async function (req, res){

    const {
        user: { _id: userId },
        house: { _id: houseId }
    } = req.body;

    try{
        if(await isFavorite(userId, houseId)){
            await addFavorite(userId, houseId);
        }else {
            await removeFavorite(userId, houseId);
        }
    }catch (error){
        res.status(createStatus('e_server_error')).json(createPayload('e_server_error'));
        return;
    }

    res.status(createStatus('success')).json(createPayload('success'));

};

exports.getFavorites = async function (req, res) {

    const { user: { _id: userId } } = req.body;
    let favorites = null;

    try{
        favorites = await getFavorites(userId);
    }catch (error){
        res.status(createStatus('e_server_error')).json(createPayload('e_server_error'));
        return;
    }

    res.status(createStatus('success')).json(createPayload('success', { favorites: favorites }));

};

exports.clearFavorite = async function (req, res) {

    const { user: { _id: userId } } = req.body;

    try{
        await clearFavorite(userId);
    }catch (error){
        res.status(createStatus('e_server_error')).json(createPayload('e_server_error'));
        return;
    }

    res.status(createStatus('success')).json(createPayload('success'));

};