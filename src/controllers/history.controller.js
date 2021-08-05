'use strict'

const { historyService: {
    addHistory,
    clearHistory,
    isHistory,
    getHistories,
    removeHistory
} } = require("../services")

exports.addHistory = async function (req, res) {

    const {
        user,
        house
    } = req.body

    await isHistory(user._id, house._id, result => {
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

}

exports.historyList = async function (req, res) {

    const { user } = req.body

    await getHistories(user._id, result => {
        res.status(result.status).json({histories: result.histories})
    }, err => {
        res.status(err.status).json({message: err.message})
    })

}

exports.historyClear = async function (req, res) {

    const { user } = req.body

    await clearHistory(user._id, result => {
        res.status(result.status).json({message: result.message})
    }, err => {
        res.status(err.status).json({message: err.message})
    })

}

exports.historyRemove = async function (req, res) {

    const {
        user,
        house
    } = req.body

    await removeHistory(user._id, house._id, result => {
        res.status(result.status).json({message: result.message})
    }, err => {
        res.status(err.status).json({message: err.message})
    })

}