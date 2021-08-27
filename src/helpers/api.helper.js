const config = require('./../config/config.json');

exports.createPayload = (ErrorCode, data = null) => {
    const payloadObject = config.responses[ErrorCode];

    return {
        error: payloadObject.error,
        code: payloadObject.code,
        message: payloadObject.message,
        data: data
    };
};

exports.createStatus = (ErrorCode) => {
    const payloadObject = config.responses[ErrorCode];

    return payloadObject.status;
};
