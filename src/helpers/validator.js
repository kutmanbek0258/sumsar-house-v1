const passwordValidator = require('password-validator');

/**
 *
 * @param password
 * @returns {Promise<boolean|string[]>}
 */
exports.isPasswordValid = async function (password) {

    let schema = new passwordValidator();

    schema
        .is().min(8) // Minimum length 8
        .is().max(100) // Maximum length 100
        .has().lowercase() // Must have lowercase letters
        .has().digits() // Must have digits
        .has().not().spaces() // Should not have spaces
        .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

    return schema.validate(password);
};