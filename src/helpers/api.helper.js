const config = require('./../config/config.json');

exports.createPayload = (statusCode, data = null) => {
    const payloadObject = config.responses[statusCode];

    return {
        error: payloadObject.error,
        code: payloadObject.code,
        message: payloadObject.message,
        data: data
    };
};

exports.createStatus = (statusCode) => {
    const payloadObject = config.responses[statusCode];

    return payloadObject.status;
};
