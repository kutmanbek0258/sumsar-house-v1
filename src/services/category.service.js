'use strict';

const category = require('../models/category');

/**
 *
 * @param name
 * @param description
 * @returns {Promise<void>}
 */
exports.addCategory = async function(name, description){
    const newCategory = new category({

        name: name,
        description: description,
        created_at: new Date()

    });

    return await newCategory.save();
};

/**
 *
 * @returns {Promise<void>}
 */
exports.getCategories = async () => {
    return await category.find();
};

/**
 *
 * @param _id
 * @returns {Promise<void>}
 */
exports.removeCategory = async function(_id){
    return await category.deleteOne({ _id: _id });
};