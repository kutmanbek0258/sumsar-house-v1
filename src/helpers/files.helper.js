const fs = require('fs');

/**
 *
 * @param base64Data
 * @param fileName
 */
exports.saveBase64Image = function (base64Data, fileName){
    fs.writeFile(fileName, base64Data, 'base64', (err) =>{
        return !err;
    });
};

/**
 *
 * @param fileName
 */
exports.deleteFile = function (fileName){
    fs.unlink(fileName,(err) => {
        return !err;
    });
};