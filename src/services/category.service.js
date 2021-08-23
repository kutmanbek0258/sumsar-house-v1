'use strict';

const category = require('../models/category');

/**
 *
 * @param name
 * @param description
 * @param callback
 * @param error
 * @returns {Promise<void>}
 */
exports.addCategory = async function(name, description, callback, error){
    const newCategory = new category({

        name: name,
        description: description,
        created_at: new Date()

    });

    await newCategory.save()

        .then(() => callback({ status: 200, message: 'Added to categories' }))

        .catch(() => error({ status: 500, message: 'Internal Server Error !' }));
};

/**
 *
 * @param callback
 * @param error
 * @returns {Promise<void>}
 */
exports.getCategories = async function(callback, error){
    await category.find()

        .then(categories => callback({ status: 200, categories: categories }))

        .catch(() => error({ status: 500, message: 'Internal Server Error !' }));
};

/**
 *
 * @param _id
 * @param callback
 * @param error
 * @returns {Promise<void>}
 */
exports.removeCategory = async function(_id, callback, error){
    await category.deleteOne({ _id: _id })

        .then(() => callback({ status: 200, message: 'Success deleted !' }))

        .catch(() => error({ status: 500, message: 'Internal Server Error !' }));
};