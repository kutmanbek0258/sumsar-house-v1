const jwt = require('jsonwebtoken');
const config = require('../config/config.json');

exports.checkToken = async function (req) {

    const token = req.headers['x-access-token'];

    if (token) {

        try {

            const decoded = jwt.verify(token, config.secret);

            return decoded.message === req.params.id;

        } catch(err) {

            return false;
        }

    } else {

        return false;
    }
}