const auth = require('basic-auth');
const shortid = require('shortid');
const jwt = require('jsonwebtoken');
const passwordValidator = require('password-validator');
const config = require('../config/config.json');
const {
        userService:
            {
                loginUser,
                changePassword,
                getProfile,
                registerUser
            }
    } = require("./../services")

exports.userAuthenticate = async function(req, res){

    const credentials = auth(req);

    if (!credentials) {

        res.status(400).json({ message: 'Invalid Request !' });

    } else {

        await loginUser(credentials.name, credentials.pass, function (result){
            if(result.status === 200){
                const token = jwt.sign(result, config.secret, { expiresIn: "365d" });

                res.status(result.status).json({ message: result.message, token: token });
            }else {
                res.status(result.status).json({ message: result.message })
            }
        })
    }
}

exports.userRegister = async function(req, res){

    const name = req.body.name;
    var email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;

    console.log(req.body);

    if (!name || !phone || !password || !name.trim() || !phone.trim() || !password.trim()) {

        res.status(400).json({message: 'Invalid Request !'});

    } else {

        if(!email){
            email = phone;
        }

        if(isPasswordValid(password)){
            await registerUser(name, email, phone, password, function (result){
                if(result.status === 200){
                    const token = jwt.sign(result, config.secret, { expiresIn: "365d" });

                    res.status(result.status).json({ message: result.message, token: token });
                }else {
                    res.status(result.status).json({ message: result.message })
                }
            })
        }else{
            res.status(400).json({ message: "invalid_pass" })
        }

    }
}

exports.userRegisterFast = async function(req, res){

    const name = req.body.name;

    if (!name || !name.trim()) {

        res.status(400).json({message: 'Invalid Request !'});

    } else {

        const phone = shortid.generate();
        const email = phone;
        const password = config.default_pass;

        if(isPasswordValid(password)){
            await registerUser(name, email, phone, password)

                .then(result => {

                    const token = jwt.sign(result, config.secret, { expiresIn: "365d" });

                    res.status(result.status).json({ message: result.message, token: token });
                })

                .catch(err => res.status(err.status).json({ message: err.message }));
        }else{
            res.status(400).json({ message: "invalid_pass" })
        }

    }
}

exports.changePassword = async function (req, res){

    if (checkToken(req)) {

        const _id = req.body._id;
        const phone = req.body.phone;
        const newPassword = req.body.password;

        if (!_id || !phone || !newPassword || !_id.trim() || !phone.trim() || !newPassword.trim()) {

            res.status(400).json({ message: 'Invalid Request !' });

        } else {

            if(isPasswordValid(newPassword)){
                await changePassword(_id, phone, newPassword)

                    .then(result => {
                        const token = jwt.sign(result, config.secret, { expiresIn: "365d" });

                        res.status(result.status).json({ message: result.message, token: token })
                    })

                    .catch(err => res.status(err.status).json({ message: err.message }));
            }else{
                res.status(400).json({ message: "invalid_pass" })
            }

        }
    } else {

        res.status(401).json({ message: 'Invalid Token !' });
    }
}

exports.getProfile = async function (req, res){

    if (checkToken(req)) {

        await getProfile(req.params.id)

            .then(result => res.json(result))

            .catch(err => res.status(err.status).json({ message: err.message }));

    } else {

        res.status(401).json({ message: 'Invalid Token !' });
    }
}

exports.changePasswordAfter = async function (req, res){

    if (checkToken(req)) {

        const oldPassword = req.body.password;
        const newPassword = req.body.newPassword;

        if (!oldPassword || !newPassword || !oldPassword.trim() || !newPassword.trim()) {

            res.status(400).json({ message: 'Invalid Request !' });

        } else {

            if(isPasswordValid(newPassword)){
                await changePassword(req.params.id, oldPassword, newPassword)

                    .then(result => res.status(result.status).json({ message: result.message }))

                    .catch(err => res.status(err.status).json({ message: err.message }));
            }else{
                res.status(400).json({ message: "invalid_pass" })
            }

        }
    } else {

        res.status(401).json({ message: 'Invalid Token !' });
    }
}

function isPasswordValid(password) {

    var schema = new passwordValidator();

    schema
        .is().min(8)                                    // Minimum length 8
        .is().max(100)                                  // Maximum length 100
        .has().lowercase()                              // Must have lowercase letters
        .has().digits()                                 // Must have digits
        .has().not().spaces()                           // Should not have spaces
        .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

    return schema.validate(password);
}

function checkToken(req) {

    const token = req.headers['x-access-token'];

    if (token) {

        try {

            var decoded = jwt.verify(token, config.secret);

            return decoded.message === req.params.id;

        } catch(err) {

            return false;
        }

    } else {

        return false;
    }
}