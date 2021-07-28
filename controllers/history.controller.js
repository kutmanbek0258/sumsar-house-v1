'use strict'

const { tokenHelper: {
    verifyToken
} } = require("./../helpers")
const { historyService: {
    addHistory,
    clearHistory,
    isHistory,
    getHistories,
    removeHistory
} } = require("./../services")

exports.addHistory = async function (req, res) {

    if(await verifyToken(req)){

        const user = req.body.user._id;
        const house = req.body.house._id;

        await isHistory(user, house, result => {
            if(result.history === false){

                addHistory(user, house, result => {
                    res.status(result.status).json({message: result.message})
                }, err => {
                    res.status(err.status).json({message: err.message})
                })

            } else {

                res.status(result.status).json({message: 'Already in history'});

            }
        }, err => {
            res.status(err.status).json({message: err.message})
        })

    }else{

        res.status(400).json({message: 'Invalid request !'})

    }

}

exports.historyList = async function (req, res) {

    if(await verifyToken(req)){

        const user = req.body._id;

        await getHistories(user, result => {
            res.status(result.status).json({histories: result.histories})
        }, err => {
            res.status(err.status).json({message: err.message})
        })

    }else{

        res.status(400).json({message: 'Invalid reguest !'})

    }

}

exports.historyClear = async function (req, res) {

    if(await verifyToken(req)){

        const user = req.body.user._id;

        await clearHistory(user, result => {
            res.status(result.status).json({message: result.message})
        }, err => {
            res.status(err.status).json({message: err.message})
        })

    }else{

        res.status(400).json({message: 'Invalid request !'})

    }

}

exports.historyRemove = async function (req, res) {

    if(await verifyToken(req)){

        const user = req.body.user._id;
        const house = req.body.house._id;

        await removeHistory(user, house, result => {
            res.status(result.status).json({message: result.message})
        }, err => {
            res.status(err.status).json({message: err.message})
        })

    }else{

        res.status(400).json({message: 'Invalid reguest !'})

    }

}