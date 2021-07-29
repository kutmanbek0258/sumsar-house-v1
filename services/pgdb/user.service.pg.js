'use strict';

const pq = require("./../../lib/db-pg")
const bcrypt = require('bcryptjs')

exports.loginUser = async function(phone, password, callback, error){

    const q = "select _id, phone, hashed_password from users where phone = $1"
    const params = [phone]

    const data = await pq.execSync(q, params, false, null);

    if(!data || data.length === 0){
        error({ status: 500, message: 'Internal Server Error !' })
    }else {
        const hashed_password = data[0].hashed_password

        if (bcrypt.compareSync(password, hashed_password)) {

            callback({ status: 200, message: phone, user : { _id: data[0]._id, phone: data[0].phone }})

        } else {

            callback({ status: 401, message: 'Invalid Credentials !' })
        }
    }
}

exports.registerUser = async function(name, email, phone, password, callback, error){
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    const q = "insert into users(name, email, phone, fast, hashed_password, created_at) values($1, $2, $3, $4, $5, now()) returning _id"

    const params = [name, email, phone, true, hash]

    const data = await pq.execSync(q, params, false, null)

    if(!data || data.length === 0){
        error({ status: 500, message: 'Internal Server Error !' });
    }else {
        callback({ status: 200, message: "registered success", user: { _id: data[0]._id } })
    }
}

exports.changePassword = async function(phone, password, newPassword, callback, error){

    const q = "select hashed_password from users where phone = $1"
    const params = [phone]

    const data = await pq.execSync(q, params, false, null)

    if(!data || data.length === 0){

    }else {
        let user = data[0]
        const hashed_password = user.hashed_password

        if (bcrypt.compareSync(password, hashed_password)) {

            const salt = bcrypt.genSaltSync(10)

            const hashed_password = bcrypt.hashSync(newPassword, salt)

            const q = "update users set hashed_password = $1"
            const params = [hashed_password]

            const data  = await pq.execSync(q, params, false, null)

            if(data || data.length > 0){
                callback({ status: 200, message: 'Password Updated Successfully !' })
            }else {
                error({ status: 500, message: 'Internal Server Error !' })
            }

        } else {

            error({ status: 401, message: 'Invalid Old Password !' })
        }
    }
}

exports.getProfile = async function(phone, callback, error){

    const q = "select _id name, phone, fast from users where phone = $1"
    const params = [phone]

    const data = await pq.execSync(q, params, false, null)

    if(!data || data.length === 0){
        error({ status: 500, message: 'Internal Server Error !' })
    }else {
        callback({ status: 200, users: data[0]})
    }
}