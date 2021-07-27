'use strict'

const { checkToken: {
    checkToken
} } = require("./../helpers")
const { favoriteService: {
    addFavorite,
    clearFavorite,
    isFavorite,
    removeFavorite,
    getFavorites
}} = require("./../services")


exports.addFavorite = async function (req, res){

    if(await checkToken(req)){

        const user = req.body.user._id;
        const house = req.body.house._id;

        await isFavorite(user, house, result => {
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

    }else{

        res.status(400).json({message: 'Invalid reguest !'})

    }

}

exports.getFavorites = async function (req, res) {

    if(await checkToken(req)){

        const user = req.body._id;

        await getFavorites(user, result => {
            res.status(result.status).json({favorites: result.favorites})
        }, err => {
            res.status(err.status).json({message: err.message})
        })

    }else{

        res.status(400).json({message: 'Invalid Request !'});

    }

}

exports.clearFavorite = async function (req, res) {

    if(await checkToken(req)){

        const user = req.body.user._id;

        await clearFavorite(user, result => {
            res.status(result.status).json({message: result.message})
        }, err => {
            res.status(err.status).json({message: err.message})
        })

    }else{

        res.status(400).json({message: 'Invalid Request !'});

    }


}