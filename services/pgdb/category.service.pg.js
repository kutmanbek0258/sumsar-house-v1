'use strict';

const pg = require("./../../lib/db-pg");

exports.addCategory = async function(name, description, callback, error){

    const q = "insert into category(name, description, created_at) values($1, $2, now()) returning _id"
    const params = [name, description]

    const data = await pg.execSync(q, params, false, null)

    if(!data || data.length === 0){
        error({ status: 500, message: 'Internal Server Error !' })
    }else {
        callback({ status: 200, message: 'Added to categories' })
    }
}

exports.getCategories = async function(callback, error){

    const q = "select * from categories"
    const params = []

    const data = await pg.execSync(q, params, false, null)

    if(!data || data.length === 0){
        error({ status: 500, message: 'Internal Server Error !' })
    }else {
        callback({ status: 200, categories: data})
    }
}

exports.removeCategory = async function(_id, callback, error){

    const q = "delete from categories where _id = $1"
    const params = [_id]

    const data = await pg.execSync(q, params, false, null)

    if(!data){
        error({ status: 500, message: 'Internal Server Error !' })
    }else {
        callback({ status: 200,  message: 'Success deleted !' })
    }
}