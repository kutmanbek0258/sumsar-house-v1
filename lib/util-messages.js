var config = require('./util-config.js');
var log = require('./util-log.js');


exports.getErrorObj = function (errCode, msgLang = null) {
    return {"code" : errCode, "message": exports.getErrorMessage(errCode, msgLang)};
}

exports.getErrorMessage = function (errCode, msgLang = null) {
    var retStr = null;
    
    // Получаем язык пользовательской сессии    
    
    // Получаем системный язык по умолчанию
    var lang = config.config.main.systemDefaultLang;
    if (msgLang) {
        lang = msgLang;
    }

    // Ищем сообщение по коду ошибки
    if (config.config.lang[errCode] && config.config.lang[errCode][lang]) {
        retStr = config.config.lang[errCode][lang];
    } else {
        retStr = errCode;
    }

    return retStr;
}