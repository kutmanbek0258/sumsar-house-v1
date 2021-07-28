const jwt = require('jsonwebtoken');
const config = require('../config/config.json');

exports.verifyToken = async function (req) {

    const token = req.headers['x-access-token'];

    if (token) {

        try {

            const decoded = jwt.verify(token, config.secret);

            console.log(decoded)

            return true;

        } catch(err) {

            return false;
        }

    } else {

        return false;
    }
}

exports.checkToken = async function(req, res, next){
    const token = req.headers['x-access-token'];

    if (token) {

        next()

    } else {

        return res.status(403).json({message: "Invalid token"})
    }
}