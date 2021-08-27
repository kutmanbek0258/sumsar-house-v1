'use strict';

const user = require('../models/user');
const bcrypt = require('bcryptjs');

/**
 *
 * @param phone
 * @returns {Promise<*>}
 */
exports.getUserByPhone = async function(phone){
    return await user.find({ phone: phone });
};

/**
 *
 * @param phone
 * @returns {Promise<*>}
 */
exports.getProfile = async function(phone){
    return await user.find({ phone: phone }, { name: 1, phone: 1, created_at: 1, _id: 1, fast: 1 });
};

/**
 *
 * @param name
 * @param email
 * @param phone
 * @param password
 * @returns {Promise<*>}
 */
exports.registerUser = async function(name, email, phone, password){
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new user({

        name: name,
        email: email,
        phone: phone,
        fast: true,
        hashed_password: hash,
        created_at: new Date()
    });

    return await newUser.save();
};

/**
 *
 * @param _id
 * @param newPassword
 * @returns {Promise<*>}
 */
exports.changePassword = async function(_id, newPassword){
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);

    return await user.findOneAndUpdate({ _id: _id }, { hashed_password: hash });
};