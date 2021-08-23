const jwt = require('jsonwebtoken');
const config = require('../config/config.json');

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.verifyToken = async function (req, res, next) {
    const token = req.headers['x-access-token'];
    const id = req.params.id;

    if (token) {
        try {
            const decoded = jwt.verify(token, config.secret);
            if(id === decoded.phone){
                next();
            }else {
                res.status(403).json({ message: 'Invalid token' });
            }
        } catch(err) {
            res.status(403).json({ message: 'Invalid token' });
        }
    } else {
        res.status(403).json({ message: 'Invalid token' });
    }
};

/**
 *
 * @param req
 * @returns {Promise<*|boolean>}
 */
exports.decodeToken = async function(req) {
    const token = req.headers['x-access-token'];
    if (token) {
        try {
            return jwt.verify(token, config.secret);
        } catch(err) {
            return false;
        }
    } else {
        return false;
    }
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.checkToken = async function(req, res, next){
    const token = req.headers['x-access-token'];
    if (token) {
        next();
    } else {
        res.status(403).json({ message: 'Invalid token' });
    }
};