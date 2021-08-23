const passwordValidator = require('password-validator');

exports.isPasswordValid = async function (password) {

    var schema = new passwordValidator();

    schema
        .is().min(8) // Minimum length 8
        .is().max(100) // Maximum length 100
        .has().lowercase() // Must have lowercase letters
        .has().digits() // Must have digits
        .has().not().spaces() // Should not have spaces
        .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

    return schema.validate(password);
};