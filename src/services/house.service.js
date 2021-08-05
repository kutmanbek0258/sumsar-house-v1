'use strict';

const house = require('../models/house');
const mongoose = require('mongoose');

exports.addHouse = async function(address, description, location, phone, price, user, category, callback, error){
    const newHouse = new house({

        _id: new mongoose.Types.ObjectId(),
        address: address,
        description: description,
        phone: phone,
        price: price,
        location: location,
        user: user,
        category: category,
        created_at: new Date()

    });

    await newHouse.save()

        .then(() => callback({status: 200, message: address , id: newHouse._id}))

        .catch(err => error({ status: 500, message: 'Internal Server Error !' }))
}

exports.editHouse = async function(_id, address, description, phone, price, location, category, callback, error){
    await house.findOneAndUpdate({ _id: _id }, {address: address, description: description, phone: phone, price: price, location: location, category: category})

        .then(callback({ status: 200, message: 'House Updated Sucessfully !' }))

        .catch(err => error({ status: 500, message: 'Internal Server Error !' }));
}

exports.getHouse = async function(_id, callback, error){
    await house.find({ _id: _id })

        .populate('user')

        .populate('category')

        .then(houses => callback({ status: 200, house: houses[0]}))

        .catch(err => error({ status: 500, message: 'Internal Server Error !' }))
}

exports.isHouseUser = async function(_id, user, callback, error){
    await house.find({_id: _id, user: user})

        .then(houses => {
            if(houses.length>0){
                callback({status: 200, house: true})
            }else{
                callback({status: 200, house: false})
            }
        })

        .catch(err => error({ status: 500, message: 'Internal Server Error !' }))
}

exports.getHouses = async function(sort, count, limit, location, radius, callback, error){
    await house.find({
        location: {
            $near :{
                $maxDistance: radius,
                $geometry: location
            }
        }
    })

        .select({
            description: 0,
            phone: 0,
            price: 0,
            user: 0,
            category: 0,
            created_at: 0
        })

        .skip( count )

        .limit( limit )

        .sort( sort )

        .then(houses => callback({ status: 200, houses: houses}))

        .catch(err => error({ status: 500, message: 'Internal Server Error !' }))
}

exports.getHousesCategory = async function(sort, category, count, limit, location, radius, callback, error){
    await house.find({
        location: {
            $near :{
                $maxDistance: radius,
                $geometry: location
            }
        },
        category: category
    })

        .select({
            description: 0,
            phone: 0,
            price: 0,
            user: 0,
            category: 0,
            created_at: 0
        })

        .skip( count )

        .limit( limit )

        .sort( sort )

        .then(houses => callback({ status: 200, houses: houses}))

        .catch(err => error({ status: 500, message: 'Internal Server Error !' }))
}

exports.getHousesRadius = async function(location, radius, callback, error){
    house.find({
        location: {
            $near :{
                $maxDistance: radius,
                $geometry: location
            }
        }
    })

        .select({
            description: 0,
            phone: 0,
            price: 0,
            user: 0,
            category: 0,
            created_at: 0
        })

        .then(houses => callback({ status: 200, houses: houses}))

        .catch(err => error({ status: 500, message: 'Internal Server Error !' }))
}

exports.getHousesKeyword = async function(sort, keyword, count, limit, location, radius, callback, error){
    await house.find({

        $text : {
            $search : keyword
        },

        location: {
            $geoWithin: {
                $centerSphere: [[
                    location.coordinates[0],
                    location.coordinates[1]
                ], radius ]
            }
        }

    })

        .select({
            description: 0,
            phone: 0,
            price: 0,
            user: 0,
            category: 0,
            created_at: 0
        })

        .skip( count )

        .limit( limit )

        .sort( sort )

        .then(houses => callback({ status: 200, houses: houses}))

        .catch(err => {
            console.log(err.message)
            error({ status: 500, message: 'Internal Server Error !' })
        })
}

exports.getHousesUser = async function(user, callback, error){
    await house.find({user: user})

        .select({
            description: 0,
            phone: 0,
            price: 0,
            user: 0,
            category: 0,
            created_at: 0
        })

        .then(houses => callback({ status: 200, houses: houses}))

        .catch(err => error({ status: 500, message: 'Internal Server Error !' }))
}

exports.removeHouse = async function(id, callback, error){
    await house.deleteOne({ _id: id })

        .then(() => callback({ status: 200,  message: 'Success deleted !' }))

        .catch(err => error({ status: 500, message: 'Internal Server Error !' }))
}