'use strict'

const config = require("../config/config.json")

const {houseService: {
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
}} = require("../services")

const {files: {
    saveBase64Image,
    deleteFile
}} = require("../helpers")

exports.addHouse = async function (req, res) {

    const {
        address,
        description,
        phone,
        price,
        location,
        user,
        category,
        image
    } = req.body

    if (!address || !description || !phone || !price || !location || !user || !category || !address.trim() || !description.trim() || !phone.trim() || !user.trim() || !category.trim()) {

        res.status(400).json({message: 'Invalid Request !'});

    } else{

        await addHouse(address, description, location, phone, price, user._id, category._id, result => {
            saveBase64Image(image, config.img_houses + result.id + "_1.png");

            res.status(result.status).json({message: result.message})
        }, err => {
            res.status(err.status).json({ message: err.message })
        })

    }

}

exports.editHouse = async function (req, res){

    const {
        _id,
        address,
        description,
        phone,
        price,
        location,
        user,
        category,
        image
    } = req.body

    if(!_id || !address || !description || !phone || !price || !location || !category || !_id.trim() || !address.trim() || !description.trim() || !phone.trim() || !category._id.trim()){

        res.status(400).json({message: 'Invalid request !'});

    } else{

        await isHouseUser(_id, user._id, result => {
            if(result.house === true){

                editHouse(_id, address, description, phone, price, location, category._id, result => {
                    if(image){

                        saveBase64Image(image, config.img_houses + _id + "_1.png");

                    }

                    res.status(result.status).json({message: result.message});
                }, err => {
                    res.status(err.status).json({message: err.message})
                })

            }else{

                res.status(400).json({message: 'Invalid reguest !'})

            }
        }, err => {
            res.status(err.status).json({message: err.message})
        })

    }

}

exports.getHouse = async function (req, res) {

    const {
        _id,
        user
    } = req.body

    await getHouse(_id, resultHouse => {
        let house = resultHouse.house.toObject();

        isFavorite(user._id, _id, result => {
            house.favorite = result.favorite;

            res.status(resultHouse.status).json(house);

            isHistory(user._id, _id, result => {
                if(result.history === false){

                    addHistory(user._id, _id);

                }
            }, err => {
                res.status(err.status).json({message: err.message})
            })
        }, err => {
            res.status(err.status).json({message: err.message})
        })
    }, err => {
        res.status(err.status).json({message: err.message})
    })

}

exports.getHouses = async function (req, res) {

    const {
        count,
        limit,
        location,
        radius,
        sort_date
    } = req.body

    if(!location){

        res.status(400).json({message: 'Invalid request !'});

    } else{

        let sort;

        if(sort_date){
            sort = {created_at: -1}
        }else{
            sort = null;
        }

        await getHouses(sort, count, limit, location, radius, result => {
            res.status(result.status).json({houses: result.houses})
        }, err => {
            res.status(err.status).json({message: err.message})
        })

    }

}

exports.getHousesUser = async function (req, res) {

    const {
        user
    } = req.body

    if(!user){

        res.status(400).json({message: 'Invalid request !'});

    } else{

        await getHousesUser(user._id, result => {
            res.status(result.status).json({houses: result.houses})
        }, err => {
            res.status(err.status).json({message: err.message})
        })

    }

}

exports.getHousesRadius = async function (req, res) {

    const {
        location,
        radius
    } = req.body

    if(!location || !radius){

        res.status(400).json({message: 'Invalid request !'});

    } else{

        await getHousesRadius(location, radius, result => {
            res.status(result.status).json({houses: result.houses})
        }, err => {
            res.status(err.status).json({message: err.message})
        })

    }

}

exports.getHousesSearch = async function (req, res) {

    const {
        count,
        limit,
        keyword,
        location,
        radius,
        sort_date
    } = req.body

    if(!location){

        res.status(400).json({message: 'Invalid request !'});

    } else{

        let sort;

        if(sort_date){
            sort = {created_at: -1}
        }else{
            sort = null;
        }

        await getHousesKeyword(sort, keyword, count, limit, location, radius, result => {
            res.status(result.status).json({houses: result.houses})
        }, err => {
            res.status(err.status).json({message: err.message})
        })

    }

}

exports.getHousesCategory = async function (req, res) {

    const {
        count,
        limit,
        category,
        location,
        radius,
        sort_date
    } = req.body

    if(!location){

        res.status(400).json({message: 'Invalid request !'});

    } else{

        let sort;

        if(sort_date){
            sort = {created_at: -1}
        }else{
            sort = null;
        }

        await getHousesCategory(sort, category, count, limit, location, radius, result => {
            res.status(result.status).json({houses: result.houses})
        }, err => {
            res.status(err.status).json({message: err.message})
        })

    }

}

exports.removeHouse = async function (req, res) {

    const {
        _id,
        user
    } = req.body

    await isHouseUser(_id, user._id, result => {
        if(result.house === true){

            removeHouse(_id, result => {
                deleteFile(config.img_houses + _id + "_1.png");
                res.status(result.status).json({message: result.message})

                clearHistory(_id);

                clearFavorite(_id);
            }, err => {
                res.status(result.status).json({message: result.message})
            })

        }else{

            res.status(400).json({message: 'Invalid request !'})

        }
    }, err => {
        res.status(400).json({message: 'Internal error !'})
    })

}