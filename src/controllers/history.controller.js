'use strict';

const { historyService: {
    addHistory,
    clearHistory,
    isHistory,
    getHistories,
    removeHistory
} } = require('../services');

const { apiHelper: { createPayload, createStatus } } = require('../helpers');

exports.addHistory = async function (req, res) {

    const {
        user,
        house
    } = req.body;

    try{
        const history = await isHistory(user._id, house._id);
        if(history.length > 0){
            res.status(createStatus('e_history_exist')).json(createPayload('e_history_exist'));
            return;
        }
    }catch (error){
        res.status(createStatus('e_server_error')).json('e_server_error');
        return;
    }

    try{
        await addHistory(user, house);
    }catch (error){
        res.status(createStatus('e_server_error')).json(createPayload('e_server_error'));
        return;
    }

    res.status(createStatus('success')).json(createPayload('success'));

};

exports.historyList = async function (req, res) {

    const { user: { _id } } = req.body;
    let histories = null;

    try{
        histories = await getHistories(_id);
    }catch (error){
        res.status(createStatus('e_server_error')).json(createPayload('e_server_error'));
        return;
    }

    res.status(createStatus('success')).json(createPayload('success', { histories: histories }));

};

exports.historyClear = async function (req, res) {

    const { user: { _id } } = req.body;

    try{
        await clearHistory(_id);
    }catch (error){
        res.status(createStatus('e_server_error')).json(createPayload('e_server-error'));
        return;
    }

    res.status(createStatus('success')).json(createPayload('success'));

};

exports.historyRemove = async function (req, res) {

    const {
        user: { _id: userId },
        house: { _id: houseId }
    } = req.body;

    try{
        await removeHistory(userId, houseId);
    }catch (error){
        res.status(createStatus('e_server_error')).json(createPayload('e_server_error'));
        return;
    }

    res.status(createStatus('success')).json(createPayload('success'));

};