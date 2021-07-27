'use strict'

const config = require("./../config/config.json")

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
}} = require("./../services")

const {checkToken: {
    checkToken
}, files: {
    saveBase64Image,
    deleteFile
}} = require("./../helpers")

exports.addHouse = async function (req, res) {

    if(await checkToken(req)){

        const address = req.body.address;
        const description = req.body.description;
        const phone = req.body.phone;
        const price = req.body.price;
        const location = req.body.location;
        const user = req.body.user._id;
        const category = req.body.category._id;
        const image = req.body.image;

        if (!address || !description || !phone || !price || !location || !user || !category || !address.trim() || !description.trim() || !phone.trim() || !user.trim() || !category.trim()) {

            res.status(400).json({message: 'Invalid Request !'});

        } else{

            await addHouse(address, description, location, phone, price, user, category, result => {
                saveBase64Image(image, config.img_houses + result.id + "_1.png");

                res.status(result.status).json({message: result.message})
            }, err => {
                res.status(err.status).json({ message: err.message })
            })

        }

    }else{

        res.status(400).json({message: 'Invalid reguest !'})

    }

}

exports.editHouse = async function (req, res){

    if(await checkToken(req)){

        const _id = req.body._id;
        const address = req.body.address;
        const description = req.body.description;
        const phone = req.body.phone;
        const price = req.body.price;
        const location = req.body.location;
        const user = req.body.user._id;
        const category = req.body.category._id;
        const image = req.body.image;

        if(!_id || !address || !description || !phone || !price || !location || !category || !_id.trim() || !address.trim() || !description.trim() || !phone.trim() || !category.trim()){

            res.status(400).json({message: 'Invalid request !'});

        } else{

            await isHouseUser(_id, user, result => {
                if(result.house === true){

                    editHouse(_id, address, description, phone, price, location, category, result => {
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

    }else{

        res.status(400).json({message: 'Invalid reguest !'})

    }

}

exports.getHouse = async function (req, res) {

    if(await checkToken(req)){

        const _id = req.body._id;
        const user = req.body.user._id;

        await getHouse(_id, resultHouse => {
            let house = resultHouse.house.toObject();

            isFavorite(user, _id, result => {
                house.favorite = result.favorite;

                res.status(resultHouse.status).json(house);

                isHistory(user, _id, result => {
                    if(result.history === false){

                        addHistory(user, _id);

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

    }else{

        res.status(400).json({message: 'Invalid reguest !'})

    }

}

exports.getHouses = async function (req, res) {

    if(await checkToken(req)){

        const count = req.body.count;
        const limit = req.body.limit;
        const location = req.body.location;
        const radius = req.body.radius;
        const sort_date = req.body.sort_date;

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

    }else{

        res.status(400).json({message: 'Invalid reguest !'})

    }

}

exports.getHousesUser = async function (req, res) {

    if(await checkToken(req)){

        const user = req.body._id;

        if(!user){

            res.status(400).json({message: 'Invalid request !'});

        } else{

            await getHousesUser(user, result => {
                res.status(result.status).json({houses: result.houses})
            }, err => {
                res.status(err.status).json({message: err.message})
            })

        }

    }else{

        res.status(400).json({message: 'Invalid request !'})

    }

}

exports.getHousesRadius = async function (req, res) {

    if(await checkToken(req)){

        const location = req.body.location;
        const radius = req.body.radius;

        if(!location || !radius){

            res.status(400).json({message: 'Invalid request !'});

        } else{

            await getHousesRadius(location, radius, result => {
                res.status(result.status).json({houses: result.houses})
            }, err => {
                res.status(err.status).json({message: err.message})
            })

        }

    }else{

        res.status(400).json({message: 'Invalid request !'})

    }

}

exports.getHousesSearch = async function (req, res) {

    if(await checkToken(req)){

        const count = req.body.count;
        const limit = req.body.limit;
        const keyword = req.body.keyword;
        const location = req.body.location;
        const radius = req.body.radius;
        const sort_date = req.body.sort_date;

        if(!location){

            res.status(400).json({message: 'Invalid request !'});

        } else{

            var sort;

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

    }else{

        res.status(400).json({message: 'Invalid reguest !'})

    }

}

exports.getHousesCategory = async function (req, res) {

    if(await checkToken(req)){

        const count = req.body.count;
        const limit = req.body.limit;
        const category = req.body.category._id;
        const location = req.body.location;
        const radius = req.body.radius;
        const sort_date = req.body.sort_date;

        if(!location){

            res.status(400).json({message: 'Invalid request !'});

        } else{

            var sort;

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

    }else{

        res.status(400).json({message: 'Invalid reguest !'})

    }

}

exports.removeHouse = async function (req, res) {


    if(await checkToken(req)){

        const _id = req.body._id;
        const user = req.body.user._id;

        await isHouseUser(_id, user, result => {
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



    }else{

        res.status(400).json({message: 'Invalid request !'})

    }

}