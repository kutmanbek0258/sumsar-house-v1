'use strict';

const category = require('../models/category');

exports.addCategory = async function(name, description, callback){
    const newCategory = new category({

        name: name,
        description: description,
        created_at: new Date()

    });

    await newCategory.save()

        .then(() => callback({ status: 200, message: 'Added to categories' }))

        .catch(err => callback({ status: 500, message: 'Internal Server Error !' }));
}

exports.getCategories = async function(callback){
    await category.find()

        .then(categories => callback({ status: 200, categories: categories}))

        .catch(err => callback({ status: 500, message: 'Internal Server Error !' }))
}

exports.removeCategory = async function(_id, callback){
    await category.deleteOne({ _id: _id })

        .then(() => callback({ status: 200,  message: 'Success deleted !' }))

        .catch(err => callback({ status: 500, message: 'Internal Server Error !' }))
}