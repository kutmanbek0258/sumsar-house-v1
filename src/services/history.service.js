'use strict';

const history = require('../models/history');
const config = require('../config/config.json');

exports.addHistory = async function(user, house, callback, error){
    const newHistory = new history({

        user: user,
        house: house,
        created_at: new Date()

    });

    await newHistory.save()

        .then(() => callback({ status: 200, message: 'Added to hostory' }))

        .catch(() => error({ status: 500, message: 'Internal Server Error !' }));
};

exports.clearHistory = async function(user, callback, error){
    await history.deleteMany({ user: user })

        .then(() => callback({ status: 200, message: 'Success cleared !' }))

        .catch(() => error({ status: 500, message: 'Internal Server Error !' }));
};

exports.clearHistoryHouse = async function(house, callback, error){
    await history.deleteMany({ house: house })

        .then(() => callback({ status: 200, message: 'Success cleared !' }))

        .catch(() => error({ status: 500, message: 'Internal Server Error !' }));
};

exports.isHistory = async function(user, house, callback, error){
    await history.find({ user: user, house: house })

        .then(history => {
            if(history.length>0){
                callback({ status: 200, history: true });
            }else{
                callback({ status: 200, history: false });
            }
            callback({ status: 200 });
        })

        .catch(() => error({ status: 500, message: 'Internal Server Error !' }));
};

exports.getHistories = async function(user, callback, error){
    await history.find({ user: user })

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

        .limit(config.history_limit)

        .sort({ created_at: -1 })

        .then(histories => callback({ status: 200, histories: histories }))

        .catch(() => error({ status: 500, message: 'Internal Server Error !' }));
};

exports.removeHistory = async function(user, house, callback, error){
    await history.deleteOne({ user: user, house: house })

        .then(() => callback({ status: 200, message: 'Success deleted !' }))

        .catch(() => error({ status: 500, message: 'Internal Server Error !' }));
};