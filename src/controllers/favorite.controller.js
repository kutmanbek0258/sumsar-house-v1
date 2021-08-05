'use strict'

const { favoriteService: {
    addFavorite,
    clearFavorite,
    isFavorite,
    removeFavorite,
    getFavorites
}} = require("../services")


exports.addFavorite = async function (req, res){

    const {
        user,
        house
    } = req.body

    await isFavorite(user._id, house._id, result => {
        if(result.favorite === false){

            addFavorite(user, house, result => {
                res.status(result.status).json({message: result.message})
            }, err => {
                res.status(err.status).json({message: err.message})
            })

        }else{

            removeFavorite(user, house, result => {
                res.status(result.status).json({message: result.message})
            }, err => {
                res.status(err.status).json({message: err.message})
            })

        }
    }, err => {
        res.status(err.status).json({message: err.message})
    })

}

exports.getFavorites = async function (req, res) {

    const { user } = req.body

    await getFavorites(user._id, result => {
        res.status(result.status).json({favorites: result.favorites})
    }, err => {
        res.status(err.status).json({message: err.message})
    })

}

exports.clearFavorite = async function (req, res) {

    const { user } = req.body

    await clearFavorite(user._id, result => {
        res.status(result.status).json({message: result.message})
    }, err => {
        res.status(err.status).json({message: err.message})
    })


}