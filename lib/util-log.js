var config = require('./util-config.js');
var moment = require('moment');
var findRemoveSync = require('find-remove');
var msg = require('./util-messages.js');
const uuidv4 = require('uuid/v4');
const SimpleNodeLogger = require('simple-node-logger');
var fluent = require('fluent-logger');

exports.ready = false;
exports.logMode = "console";
exports.logLevel = "error";

exports.instanceName = null;
exports.serviceName = null;

exports.flog = null;
exports.slog = null;

exports.errorsToSend = [];

exports.currStats = [];

exports.ApiErr = class extends Error {
    constructor (errCode) {
        super(errCode);
        Error.captureStackTrace(this, exports.rec);
    }
};

var currRefs = {};

exports.init = async function() {
    return new Promise((resolve, reject) => {
        try {

            exports.instanceName = config.config.main.fluentdInstanceName;
            exports.serviceName = config.config.main.fluentdServiceName;

            if (!exports.serviceName) {
                exports.serviceName = config.serviceName;
            }

            logOpts = {
                logDirectory: config.logFolder,
                fileNamePattern:'<DATE>.log',
                dateFormat:'YYYY.MM.DD'
            };

            exports.flog = SimpleNodeLogger.createRollingFileLogger(logOpts);
            exports.flog.setLevel('trace');

            statOpts = {
                logDirectory: config.logFolder,
                fileNamePattern:'stat-<DATE>.log',
                dateFormat:'YYYY-MM-DD'
            };

            exports.slog = SimpleNodeLogger.createRollingFileLogger(statOpts);
            exports.slog.setLevel('trace');

            if (typeof(config.config.main.logLevel) != "undefined") {
                if (config.config.main.logLevel === "trace" || config.config.main.logLevel === "debug" || config.config.main.logLevel === "info" || config.config.main.logLevel === "warning") {
                    exports.logLevel = config.config.main.logLevel;
                }
            }

            if (typeof(config.config.main.logMode) != "undefined" && config.config.main.logMode === "file") {
                exports.logMode = "file";
                console.log("Включен режим логирования в файлы. Уровень логирования: " + exports.logLevel + ". Путь: " + config.logFolder);
            }

            if (typeof(config.config.main.logMode) != "undefined" && config.config.main.logMode === "fluent") {
                exports.logMode = "fluent";

                fluent.configure(config.config.main.fluentdServiceName, {
                    host: config.config.main.fluentdHost,
                    port: config.config.main.fluentdPort,
                    timeout: 3.0,
                    reconnectInterval: 1200000 // 20 minutes
                });

                console.log("Включен режим логирования во fluentd. Сервер: " + config.config.main.fluentdHost + ":" + config.config.main.fluentdPort);
            }

            if (exports.logMode === "console" || config.config.main.logMode === "console") {
                console.log("Включен режим логирования в консоль. Уровень логирования: " + exports.logLevel);
                if (config.config.main.traceFilterByUserId && config.config.main.traceFilterByUserId !== 0 && exports.logLevel === 'trace') {
                    exports.info("Включен режим фильтрации трассировочных логов для пользователя " + config.config.main.traceFilterByUserId);
                }
            }


            setInterval(statsClean, 60*1000);

            config.registerChangeCallback(onConfigChange);
            exports.ready = true;
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

function removeLogEscaping(rec) {
    var retRec = rec;
    if (retRec.error) retRec.error = removeStrEscaping(removeStrEscaping(removeStrEscaping(rec.error)));
    if (retRec.warn) retRec.warn = removeStrEscaping(removeStrEscaping(removeStrEscaping(rec.warn)));
    if (retRec.info) retRec.info = removeStrEscaping(removeStrEscaping(removeStrEscaping(rec.info)));
    if (retRec.debug) retRec.debug = removeStrEscaping(removeStrEscaping(removeStrEscaping(rec.debug)));
    if (retRec.trace) retRec.trace = removeStrEscaping(removeStrEscaping(removeStrEscaping(rec.trace)));

    return retRec;
}

function removeStrEscaping(str) {
    var ret = str;
    if (typeof ret === 'object') ret = JSON.stringify(ret);
    if (ret) {
        try {
            ret = ret.replace(`\"`, `"`);
            ret = ret.replace(`\\n`, `\n`);
            ret = ret.replace(`\\\\`, `\\`);
            ret = ret.replace(`\/`, `/`);
        } catch(err) {
            console.log("Ошибка при обработке строки логирования. \nОшибка: " + err + "\nСтрока: " + JSON.stringify(str));
        }
    }
    return ret;
}

exports.rec = async function(errRec) {

    // Если запись является сообщением об ошибке, то создаем дополнительные поля

    var errObject = null;
    var logDate = moment();

    if (exports.instanceName) {
        errRec.instance = exports.instanceName;
    }
    errRec.serviceName = exports.serviceName;

    if (errRec.error || errRec.sysErr) {
        // if (!errRec.code) errRec.code = 'E_ServerError';
        if (!errRec.code && errRec.sysErr && errRec.sysErr.code) errRec.code = errRec.sysErr.code;
        errObject = new exports.ApiErr(errRec.code);
        errRec.stack = errObject.stack;

        if (errRec.code) {
            errRec.apiCode = errRec.code;
            //errRec.apiStatus = api.apiErrorsHttpCodes[errRec.code];
            if (!errRec.apiStatus) errRec.apiStatus = 500;
            errRec.apiMessage = msg.getErrorMessage(errRec.apiCode);
        }

        if (errRec.sysErr) {
            errRec.sysCode = errRec.sysErr.code;
            errRec.sysMessage = errRec.sysErr.message;
            errRec.sysStack = errRec.sysErr.stack;
        }
    }

    if (errRec.req) {
        // Получаем данные HTTP запроса
        if (errRec.req.connection) {
            errRec.reqIp = errRec.req.headers['x-real-ip'] || errRec.req.headers['x-forwarded-for'] || errRec.req.connection.remoteAddress || errRec.req.socket.remoteAddress || errRec.req.connection.socket.remoteAddress;
        }

        errRec.reqBody = errRec.req.body;
        errRec.reqHeaders = errRec.req.headers;
        errRec.reqParams = errRec.req.params;

        errRec.reqMethod = errRec.req.method;
        errRec.reqOriginalUrl = errRec.req.originalUrl;
    }

    var savedRec = {};

    if (errRec.refId && currRefs[errRec.refId]) {
        savedRec = currRefs[errRec.refId];

        if (savedRec) {
            // Получаем сохраненные ранее данные
            if (!errRec.reqIp) errRec.reqIp = savedRec.reqIp;
            if (!errRec.reqBody) errRec.reqBody = savedRec.reqBody;
            if (!errRec.reqHeaders) errRec.reqHeaders = savedRec.reqHeaders;
            if (!errRec.reqParams) errRec.reqParams = savedRec.reqParams;
            if (!errRec.reqMethod) errRec.reqMethod = savedRec.reqMethod;
            if (!errRec.reqOriginalUrl) errRec.reqOriginalUrl = savedRec.reqOriginalUrl;

            if (!errRec.userId) errRec.userId = savedRec.userId;
            if (!errRec.userLogin) errRec.userLogin = savedRec.userLogin;
            if (!errRec.userName) errRec.userName = savedRec.userName;
        }
    }

    // Обновляем данные в savedRec
    if (errRec.refId) {
        if (!savedRec['reqIp'] && errRec['reqIp']) savedRec['reqIp'] = errRec['reqIp'];
        if (!savedRec['reqBody'] && errRec['reqBody']) savedRec['reqBody'] = errRec['reqBody'];
        if (!savedRec['reqHeaders'] && errRec['reqHeaders']) savedRec['reqHeaders'] = errRec['reqHeaders'];
        if (!savedRec['reqParams'] && errRec['reqParams']) savedRec['reqParams'] = errRec['reqParams'];
        if (!savedRec['reqMethod'] && errRec['reqMethod']) savedRec['reqMethod'] = errRec['reqMethod'];
        if (!savedRec['reqOriginalUrl'] && errRec['reqOriginalUrl']) savedRec['reqOriginalUrl'] = errRec['reqOriginalUrl'];
        if (!savedRec['userId'] && errRec['userId']) savedRec['userId'] = errRec['userId'];
        if (!savedRec['userLogin'] && errRec['userLogin']) savedRec['userLogin'] = errRec['userLogin'];
        if (!savedRec['userName'] && errRec['userName']) savedRec['userName'] = errRec['userName'];

        savedRec['lastUpdated'] = logDate.toISOString();
        currRefs[errRec.refId] = savedRec;
    }

    // Делаем запись в лог
    var logLabel = null;

    if (errRec.error) logLabel = 'ERROR';
    if (!logLabel && errRec.warn) logLabel = 'WARNING';
    if (!logLabel && errRec.info) logLabel = 'INFO';
    if (!logLabel && errRec.debug) logLabel = 'DEBUG';
    if (!logLabel && errRec.trace) logLabel = 'TRACE';
    if (!logLabel) logLabel = 'TRACE';
    errRec.logLabel = logLabel;

    if (errRec.error && typeof errRec.error == 'object') {
        errRec.error = JSON.stringify(errRec.error);
    }
    if (errRec.warn && typeof errRec.warn == 'object') {
        errRec.warn = JSON.stringify(errRec.warn);
    }
    if (errRec.info && typeof errRec.info == 'object') {
        errRec.info = JSON.stringify(errRec.info);
    }
    if (errRec.debug && typeof errRec.debug == 'object') {
        errRec.debug = JSON.stringify(errRec.debug);
    }
    if (errRec.trace && typeof errRec.trace == 'object') {
        errRec.trace = JSON.stringify(errRec.trace);
    }

    var logMode = "console";
    if (exports.ready === true) {
        logMode = exports.logMode;
    }

    //var logDateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    //logMsg = logDateTime + " " + logLabel +  ": " + logMsg;

    // var logDateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    // errRec.time = moment().format("YYYY-MM-DD HH:mm:ss");
    errRec.time = logDate.toISOString();

    // Выходим, если уровень логирования недостаточный
    if (exports.logLevel === 'error') {
        if (logLabel === 'TRACE' || logLabel === 'DEBUG' || logLabel === 'INFO' || logtype === 'WARNING') return;
    }

    if (exports.logLevel === 'warning') {
        if (logLabel === 'TRACE' || logLabel === 'DEBUG' || logLabel === 'INFO') return;
    }

    if (exports.logLevel === 'info') {
        if (logLabel === 'TRACE' || logLabel === 'DEBUG') return;
    }

    if (exports.logLevel === 'debug') {
        if (logLabel === 'TRACE') return;
    }

    if (logMode === "console" || logLabel === 'ERROR' || logLabel === 'WARNING' || logLabel === 'INFO') {
        errMsg = null;

        if (logLabel === 'ERROR') errMsg = "\x1b[31m";
        if (logLabel === 'WARNING') errMsg = "\x1b[33m";
        if (logLabel === 'INFO') errMsg = "\x1b[34m";
        if (logLabel === 'DEBUG') errMsg = "\x1b[92m";
        if (logLabel === 'TRACE') errMsg = "\x1b[37m";

        errMsg = errMsg + "███ " + errRec.time + " " + logLabel;

        if (errRec.error) {
            errMsg = errMsg + ": ";
            if (errRec.code) errMsg = errMsg + errRec.code;
            errMsg = errMsg + ", " + errRec.error;
        }

        if (errRec.warn) errMsg = errMsg + '\n' + errRec.warn;
        if (errRec.info) errMsg = errMsg + '\n' + errRec.info;
        if (errRec.debug) errMsg = errMsg + '\n' + errRec.debug;
        if (errRec.trace) errMsg = errMsg + '\n' + errRec.trace;

        if (logLabel === 'TRACE' || logLabel === 'ERROR') {
            if (errRec.apiCode) errMsg = errMsg + '\n' + "API returns: " + errRec.apiStatus + ", " + errRec.apiCode + ", " + errRec.apiMessage;
            if (errRec.sysCode) errMsg = errMsg + '\n' + "System Error: " + errRec.sysCode + " " + errRec.sysMessage;
            if (errRec.stack) errMsg = errMsg + '\n' + errRec.stack;

            var bodyForLog = "";
            if (errRec.reqBody) {
                JSON.parse(JSON.stringify(errRec.reqBody));
                if (errRec.reqOriginalUrl && errRec.reqOriginalUrl.includes("images")) bodyForLog = "{...}";
            }

            var headersForLog = "";
            if (errRec.reqHeaders) {
                JSON.parse(JSON.stringify(errRec.reqHeaders));
                if (errRec.reqHeaders && errRec.reqHeaders["session-token"]) headersForLog["session-token"] = "...";
                if (errRec.reqHeaders && errRec.reqHeaders["caller-token"]) headersForLog["caller-token"] = "...";
                headersForLog = JSON.stringify(headersForLog);
            }

            if (errRec.reqMethod) errMsg = errMsg + '\n' + "Request data: " + errRec.reqMethod + " " + errRec.reqOriginalUrl + " (" + errRec.reqIp + ") \nHeaders: " + headersForLog + "\nURL Params: " + JSON.stringify(errRec.reqParams) + "\nBody: " + bodyForLog;
        }

        if (logLabel === 'TRACE' || logLabel === 'DEBUG' || logLabel === 'ERROR') {
            var userData = errRec.userId;
            if (errRec['userLogin']) userData = userData + ", " + errRec['userLogin'];
            if (errRec['userName']) userData = userData + ", " + errRec['userName'];

            if (errRec.userId) errMsg = errMsg + '\n' + "User data: " + userData;
        }

        if (errRec.refId) errMsg = errMsg + "\n" + "Ref: " + errRec.refId;

        errMsg = errMsg + "\x1b[0m";


        var isFiltered = false;

        if (config.config.main.traceFilterByUserId && (logLabel === 'TRACE' || logLabel === 'DEBUG')) {
            if (errRec.userId && errRec.userId === config.config.main.traceFilterByUserId) {
                isFiltered = false;
            } else {
                isFiltered = true;
            }
        }

        if (!isFiltered) {
            console.log(errMsg);
        }
    }

    fileLog = {};

    if (errRec.time) fileLog.time = errRec.time;
    if (errRec.logLabel) fileLog.logLabel = errRec.logLabel;
    if (errRec.instance) fileLog.instance = errRec.instance;
    if (errRec.serviceName) fileLog.serviceName = errRec.serviceName;
    if (errRec.code) fileLog.code = errRec.code;
    if (errRec.error) fileLog.error = errRec.error;
    if (errRec.warn) fileLog.warn = errRec.warn;
    if (errRec.info) fileLog.info = errRec.info;
    if (errRec.debug) fileLog.debug = errRec.debug;
    if (errRec.trace) fileLog.trace = errRec.trace;
    if (errRec.apiCode) fileLog.apiCode = errRec.apiCode;
    if (errRec.apiStatus) fileLog.apiStatus = errRec.apiStatus;
    if (errRec.apiMessage) fileLog.apiMessage = errRec.apiMessage;
    if (errRec.stack) fileLog.stack = errRec.stack;
    if (errRec.sysCode) fileLog.sysCode = errRec.sysCode;
    if (errRec.sysMessage) fileLog.sysMessage = errRec.sysMessage;
    if (errRec.sysCode) fileLog.sysCode = errRec.sysCode;
    if (errRec.sysStack) fileLog.sysStack = errRec.sysStack;

    if (errRec.reqIp) fileLog.reqIp = errRec.reqIp;
    if (errRec.reqBody) fileLog.reqBody = errRec.reqBody;
    if (errRec.reqHeaders) fileLog.reqHeaders = errRec.reqHeaders;
    if (errRec.reqParams) fileLog.reqParams = errRec.reqParams;
    if (errRec.reqMethod) fileLog.reqMethod = errRec.reqMethod;
    if (errRec.reqOriginalUrl) fileLog.reqOriginalUrl = errRec.reqOriginalUrl;
    if (errRec.userId) fileLog.userId = errRec.userId;
    if (errRec.userLogin) fileLog.userLogin = errRec.userLogin;
    if (errRec.userName) fileLog.userName = errRec.userName;

    if (errRec.refId) fileLog.refId = errRec.refId;

    if (logMode === "file") {
        if (logLabel === 'ERROR') exports.flog.error(JSON.stringify(removeLogEscaping(fileLog)));
        if (logLabel === 'WARNING') exports.flog.warn(JSON.stringify(removeLogEscaping(fileLog)));
        if (logLabel === 'INFO') exports.flog.info(JSON.stringify(removeLogEscaping(fileLog)));
        if (logLabel === 'DEBUG') exports.flog.debug(JSON.stringify(removeLogEscaping(fileLog)));
        if (logLabel === 'TRACE') exports.flog.trace(JSON.stringify(removeLogEscaping(fileLog)));
    }

    if (logMode === 'fluent') {
        // Подготавливаем запись для fluent
        fluent.emit(logLabel, removeLogEscaping(fileLog));
    }

    return errObject;
}

exports.error = function (msg, sysErr=null, refId = null) {
    return exports.rec({ error: msg, sysErr: sysErr, refId: refId });
}

exports.warn = function (msg, refId = null) {
    exports.rec({ warn: msg, refId: refId });
}

exports.info = function (msg, refId = null) {
    exports.rec({ info: msg, refId: refId });
}

exports.debug = function (msg, refId = null) {
    exports.rec({ debug: msg, refId: refId });
}

exports.trace = function (msg, refId = null) {
    exports.rec({ trace: msg, refId: refId });
}

function statsClean() {
    var nowDate = moment();

    for (var i=0; i<exports.currStats.length; i++) {
        var started = exports.currStats[i]['statStart'];
        var dateDiffSec = nowDate.diff(moment(started), 'seconds');

        if (dateDiffSec >= 1800) {
            // statToDel.push(exports.currStats[i]['statId']);
            exports.trace("Удаление незакрытого счетчика производительности: " + exports.currStats[i]['statId'] + " (" + exports.currStats[i]['statCounter'] + ") " + ". Данные: " + JSON.stringify(exports.currStats[i]['statData']));
            exports.currStats.splice(i, 1);
            i--;
        }
    }

    for (var r in currRefs) {
        if (currRefs.hasOwnProperty(r)) {
            var lastUpdated = currRefs[r]['lastUpdated'];
            var dateDiffSec = nowDate.diff(moment(lastUpdated), 'seconds');
            if (dateDiffSec >= 600) {
                delete currRefs[r];
            }
        }
    }

}

exports.statStart = function (counter, data, ref) {

    // Генерируем уникальный id и сохраняем данные в массив
    var newStatId = uuidv4();

    var statObj = {
        statId: newStatId,
        statData: data,
        statCounter: counter,
        statStart: moment().toISOString(),
        statRef: ref
    }

    exports.currStats.push(statObj);
    return newStatId;
}

exports.statEnd = function (statId) {
    // Ищем в массиве счетчик и завершаем его
    var foundInd = null;
    var nowDate = moment();

    var currCounter = null;

    for (var i=0; i<exports.currStats.length; i++) {
        if (statId === exports.currStats[i]['statId']) {
            foundInd = i;
            currCounter = exports.currStats[i]['statCounter'];
            break;
        }
    }

    if (foundInd==null) {
        exports.error("Счетчик " + statId + " не найден в массиве счетчиков");
        return;
    }

    // Делаем замер времени в секундах
    //var dateDiffSec = nowDate.diff(moment(exports.currStats[foundInd]['statStart']), 'seconds');
    var dateDiffSec = nowDate.diff(moment(exports.currStats[foundInd]['statStart']));
    dateDiffSec = dateDiffSec / 1000;
    dateDiffSec = Math.round(dateDiffSec * 100) / 100;

    var logData = {
        counter: exports.currStats[foundInd]['statCounter'],
        started: exports.currStats[foundInd]['statStart'],
        finished: nowDate.toISOString(),
        durationSec: dateDiffSec,
        data: exports.currStats[foundInd]['statData'],
        ref: exports.currStats[foundInd]['statRef'],
        instance: exports.instanceName,
        serviceName: exports.serviceName,
        logLabel: 'STAT'
    }

    if (exports.logMode === "file") {
        exports.slog.info(JSON.stringify(logData));
    }

    if (exports.logMode === 'fluent') {
        fluent.emit('STAT', logData);
    }

    // Удаляем счетчик из массива
    exports.currStats.splice(foundInd, 1);
}

exports.statCancel = function (statId) {
    var foundInd = null;

    for (var i=0; i<exports.currStats.length; i++) {
        if (statId === exports.currStats[i]['statId']) {
            foundInd = i;
            break;
        }
    }

    exports.currStats.splice(foundInd, 1);
}

exports.statFixed = function(counter, started, durationSec, data) {

    var logData = {
        counter: counter,
        started: started,
        durationSec: durationSec,
        data: data,
        instance: exports.instanceName,
        serviceName: exports.serviceName,
        logLabel: 'STAT'
    }

    if (exports.logMode === "file") {
        exports.slog.info(JSON.stringify(logData));
    }

    if (exports.logMode === 'fluent') {
        fluent.emit('STAT', logData);
    }
}

exports.log = function (logtype, msg) {

    if (msg == null) msg = 'NULL';
    var logLabel = 'DEBUG';

    if (logtype === 'E') logLabel = 'ERROR';
    if (logtype === 'I') logLabel = 'INFO';
    if (logtype === 'W') logLabel = 'WARNING';
    if (logtype === 'S') logLabel = 'STAT';
    if (logtype === 'T') logLabel = 'TRACE';

    if (logtype.length !== 1) {
        console.log('В функцию логирования передан некорректный тип лога: ' + logtype + ', заменен на DEBUG');
        logtype = 'D';
        logLabel = 'DEBUG';
    }

    if (exports.logLevel === 'error') {
        if (logtype === 'T' || logtype === 'D' || logtype == 'I' || logtype == 'W') return;
    }

    if (exports.logLevel === 'warning') {
        if (logtype == 'T' || logtype == 'D' || logtype == 'I') return;
    }

    if (exports.logLevel == 'info') {
        if (logtype == 'T' || logtype == 'D') return;
    }

    if (exports.logLevel == 'debug') {
        if (logtype == 'T') return;
    }

    var logMsg = msg;
    if (typeof msg == 'object') {
        logText1 = JSON.stringify(msg);
    }

    var logMode = "console";
    if (exports.ready == true) {
        logMode = exports.logMode;
    }

    var logDateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    logMsg = logDateTime + " " + logLabel +  ": " + logMsg;
    //var coloredMsg = "";

    // https://docs.rs/crate/colorify/0.1.0/source/src/lib.rs
    if (logMode == "console" || logtype == 'E') {
        if (logtype == 'E') {
            //coloredMsg = "\u001b[41m  \x1b[0m" + "\x1b[1;31m" + " " + logDateTime + " " + logLabel + " " + logMsg + "\x1b[0m";
            console.log("\x1b[31m%s\x1b[0m", logMsg);
        }
        if (logtype == 'W') {
            //coloredMsg = "\u001b[43m  \x1b[0m" + "\x1b[1;93m" + " " + logDateTime + " " + logLabel + " " + logMsg + "\x1b[0m";
            console.log("\x1b[33m%s\x1b[0m", logMsg);
        }
        if (logtype == 'I') {
            //coloredMsg = "\u001b[44m  \x1b[0m" + "\x1b[1;34m" + " " + logDateTime + " " + logLabel + " " + logMsg + "\x1b[0m";
            console.log("\x1b[34m%s\x1b[0m", logMsg);
        }
        if (logtype == 'T') {
            //coloredMsg = "\u001b[47m  \x1b[0m" + "\u001b[37m" + " " + logDateTime + " " + logLabel + " " + logMsg + "\u001b[0m";
            console.log("\x1b[37m%s\x1b[0m", logMsg);
        }
        if (logtype == 'D') {
            //coloredMsg = "\u001b[47m  \x1b[0m" + "\u001b[37m" + " " + logDateTime + " " + logLabel + " " + logMsg + "\x1b[0m";
            console.log("\x1b[92m%s\x1b[0m", logMsg);
        }

        //console.log(coloredMsg);
    }

    if (logMode === "file") {
        if (logtype === 'E') exports.flog.error(logMsg);
        if (logtype === 'I') exports.flog.info(logMsg);
        if (logtype === 'W') exports.flog.warn(logMsg);
        if (logtype === 'D') exports.flog.debug(logMsg);
        if (logtype === 'T') exports.flog.trace(logMsg);
    }

    if (logtype === 'S') {
        exports.slog.info(msg);
    }

};


function onConfigChange() {
    if (typeof(config.config.main.logLevel) != "undefined") {
        if (config.config.main.logLevel === "debug" || config.config.main.logLevel === "info" || config.config.main.logLevel === "warning") {
            if (exports.logLevel !== config.config.main.logLevel) {
                exports.logLevel = config.config.main.logLevel;
                console.log("Уровень логирования изменен на " + exports.logLevel);
            }
        }
    }

    if (typeof(config.config.main.logMode) != "undefined") {
        if (config.config.main.logMode === "file" || config.config.main.logMode === "console") {
            if (exports.logMode !== config.config.main.logMode) {
                exports.logMode = config.config.main.logMode;
                console.log("Режим логирования изменен на " + exports.logMode);
            }
        }
    }
}

function oldLogsClean() {
    // Удаляет файловые логи старше 100 дней
    var logAge = config.config.main.maxLogAgeSec*86400;
    var result = findRemoveSync(config.logFolder, {age: {seconds: logAge}, extensions: '.log', limit: 100});
    if (Object.keys(result).length !== 0) {
        console.log("Удалены старые лог файлы: " + JSON.stringify(result));
    }
}
