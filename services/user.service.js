'use strict';

const user = require('../models/user');
const bcrypt = require('bcryptjs');
const config = require('../config/config.json');

exports.loginUser = async function(phone, password, callback, error){
    await user.find({phone: phone})

        .then(users => {

            if (users.length === 0) {

                callback({ status: 404, message: 'User Not Found !' });

            } else {

                return users[0];

            }
        })

        .then(user => {

            const hashed_password = user.hashed_password;

            if (bcrypt.compareSync(password, hashed_password)) {

                callback({ status: 200, message: phone, user : { _id: user._id }});

            } else {

                callback({ status: 401, message: 'Invalid Credentials !' });
            }
        })

        .catch(err => error({ status: 500, message: 'Internal Server Error !' }));
}

exports.changePassword = async function(phone, password, newPassword, callback, error){
    await user.find({ phone: phone })

        .then(users => {

            let user = users[0];
            const hashed_password = user.hashed_password;

            if (bcrypt.compareSync(password, hashed_password)) {

                const salt = bcrypt.genSaltSync(10);

                user.hashed_password = bcrypt.hashSync(newPassword, salt);

                return user.save();

            } else {

                callback({ status: 401, message: 'Invalid Old Password !' });
            }
        })

        .then(user => callback({ status: 200, message: 'Password Updated Successfully !' }))

        .catch(err => error({ status: 500, message: 'Internal Server Error !' }));
}

exports.getProfile = async function(phone, callback, error){
    await user.find({ phone: phone }, { name: 1, phone: 1, created_at: 1, _id: 1, fast: 1 })

        .then(users => callback({ status: 200, users: users[0]}))

        .catch(err => error({ status: 500, message: 'Internal Server Error !' }))
}

exports.registerUser = async function(name, email, phone, password, callback, error){
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

    await newUser.save()

        .then(() => callback({ status: 200, message: phone }))

        .catch(err => {

            if (err.code === 11000) {

                console.log(err);

                error({ status: 409, message: 'User Already Registered !' });

            } else {

                error({ status: 500, message: 'Internal Server Error !' });
            }
        });
}

exports.changePassword = async function(_id, phone, newPassword, callback, error){
    await user.find({ _id: _id })

        .then(users => {

            var password = config.default_pass;

            let user = users[0];
            const hashed_password = user.hashed_password;

            if (bcrypt.compareSync(password, hashed_password)) {

                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(newPassword, salt);

                user.phone = phone;
                user.email = phone;
                user.fast = false;
                user.hashed_password = hash;

                return user.save();

            } else {

                callback({ status: 401, message: 'Invalid Old Password !' });
            }
        })

        .then(user => callback({ status: 200, message: phone }))

        .catch(err => error({ status: 500, message: 'User existed !' }));
}