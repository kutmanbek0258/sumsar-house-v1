'use strict';

const house = require('../models/house');
const mongoose = require('mongoose');

const pg = require("./../../lib/db-pg")

exports.addHouse = async function(address, description, location, phone, price, user, category, callback, error){

    const q = "insert into houses(address, description, latitude, longitude, phone, price, user, category, created_at) values($1, $2, $3, $4. $5, $6, $7, $8, now()) returning _id"
    const params = [address, description, location.coordinates[1], location.coordinates[0], phone, price, user, category]

    const data = await pg.execSync(q, params, false, null)

    if(!data || data.length === 0){
        error({ status: 500, message: 'Internal Server Error !' })
    }else {
        callback({status: 200, message: "created success" , id: data[0]._id})
    }
}

exports.editHouse = async function(_id, address, description, phone, price, location, category, callback, error){

    const q = "update houses set address = $1, description = $2, phone = $3, price = $4, latitude = $5, longitude = $6, category = $7 where _id = $1"
    const params = [address, description, phone, price, location.coordinates[1], location.coordinates[0], category, _id]

    const data = await pg.execSync(q, params, false, null)

    if(!data || data.length === 0){
        error({ status: 500, message: 'Internal Server Error !' })
    }else {
        callback({ status: 200, message: 'House Updated Successfully !' })
    }
}

exports.getHouse = async function(_id, callback, error){

    const q = "select _id, address, description, phone, latitude, longitude, category, user, created_at from houses where _id = $1"
    const params = [_id]

    const data = await pg.execSync(q, params, false, null)

    if(!data || data.length === 0){
        error({ status: 500, message: 'Internal Server Error !' })
    }else {
        callback({ status: 200, house: data[0]})
    }
}

exports.isHouseUser = async function(_id, user, callback, error){

    const q = "select _id from houses where _id = $1"
    const params = [_id]

    const data = await pg.execSync(q, params, false, null)

    if(!data || data.length === 0){
        error({ status: 500, message: 'Internal Server Error !' })
    }else {
        if(data.length>0){
            callback({status: 200, house: true})
        }else{
            callback({status: 200, house: false})
        }
    }
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