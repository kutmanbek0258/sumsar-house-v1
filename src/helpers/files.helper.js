const fs = require('fs');

exports.saveBase64Image = async function (base64Data, fileName){
    fs.writeFile(fileName, base64Data, 'base64', function(err) {
        return !err;
    });
}

exports.deleteFile = async function (fileName){
    fs.unlink(fileName,function(err) {
        return !err;
    });
}