var moment = require('moment');
var os = require('os');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var _ = require('underscore');
var msg = require('./util-messages.js');

exports.msFilesPath = null;
exports.serviceName = 'sumsar_home';
exports.isConfigLoaded = false;
exports.config = {};
exports.auth = null;
exports.metrics = {};
exports.logMode = "console";
exports.ready = false;
exports.tempFolder = null;
exports.logFolder = null;
exports.langSupported = [];
exports.isShutdown = false;
var msFilesBasePath = 'msdata';
var changeCallbacks = [];

exports.init = async function() {
    return new Promise((resolve, reject) => {
        try {
            initFileCatalog(function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                initConfig(function(err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    console.log("Инициализация конфигурации завершена");
                    resolve();
                });
            });
        } catch (err) {
            reject(err);
        }
    });
}

exports.registerChangeCallback = function(func) {
    changeCallbacks.push(func);
}

function initFileCatalog(callback) {
    // Инициализация файлового каталога
    if (os.platform() == 'win32') {
        exports.msFilesPath = 'C:\\' + msFilesBasePath + '\\' + exports.serviceName + '\\data\\';
    }
    else if (os.platform() == 'linux') {
        exports.msFilesPath = '/' + msFilesBasePath + '/' + exports.serviceName + '/data/';
    }
    else if (os.platform() == 'darwin') {
        exports.msFilesPath = '/' + msFilesBasePath + '/' + exports.serviceName + '/data/';
    }
    // Пробуем открыть или создать файловый каталог
    mkdirp.sync(exports.msFilesPath, function (err) {
        if (err) {
            console.error('Не удалось открыть или создать каталог для сервиса: ' + exports.msFilesPath);
            throw (err);
        }
    });
    // Проверяем файловый каталог на существование
    if (fs.existsSync(exports.msFilesPath)) {
        console.log('Файловый каталог ' + exports.msFilesPath + ' подключен к сервису ' + exports.serviceName);
        isFileResourceMounted = true;
        exports.isFileResourceMounted = true;
    }
    else {
        console.error('Не удалось подключить или создать файловый ресурс: ' || exports.msFilesPath || ' для сервиса ' + exports.serviceName + ' на хосте ' + hostName);
        isFileResourceMounted = false;
        exports.isFileResourceMounted = false;
        throw ("Не удалось открыть файловый каталог сервиса: " + exports.msFilesPath);
    }
    // Создаем каталог temp
    var tempFolder = path.join(exports.msFilesPath, 'temp');
    exports.tempFolder = tempFolder;
    mkdirp.sync(tempFolder, function (err) {
        if (err) {
            console.error('Не удалось открыть или создать каталог для temp файлов: ' + tempFolder + '. Ошибка: ' + err);
            throw (err);
        }
    });

    // Создаем каталог logs
    var logFolder = path.join(exports.msFilesPath, 'logs');
    exports.logFolder = logFolder;
    mkdirp.sync(logFolder, function (err) {
        if (err) {
            console.error('Не удалось открыть или создать каталог для temp файлов: ' + logFolder + '. Ошибка: ' + err);
            throw (err);
        }
    });

    callback(null);
}

function initConfig(callback) {
    // Инициализируем конфиги и движок для их обновления с диска в памяти
    configPath = path.join(exports.msFilesPath, 'config');
    mkdirp.sync(configPath, function (err) {
        if (err) {
            console.error('Не удалось открыть или создать каталог для конфиг файлов: ' + configPath + '. Ошибка: ' + err);
            throw (err);
        }
    });
    loadConfig();

    // Инициализация функции перезагрузки конфигов (каждые 10 секунд)
    setInterval(loadConfig, 10000);
    exports.ready = true;
    callback(null);
}

function loadConfig() {
    var newConfig = {};
    var newAuth = null;
    var isReadError = false;
    // Считываем содержимое каталога
    var confFiles = fs.readdirSync(configPath);
    for (var i in confFiles) {
        var currFileName = confFiles[i];
        // Обрабатываем только файлы .json
        if (path.extname(currFileName) != '.json')
            continue;
        // Убираем расширение файла
        var currConfigName = currFileName.replace(/\.[^/.]+$/, "");
        var currFilePath = path.join(configPath, currFileName);
        // Считываем и парсим .json файл
        var currConfig = null;
        try {
            currConfig = JSON.parse(fs.readFileSync(currFilePath, 'utf8'));
            if (currConfigName == 'auth') {
                newAuth = currConfig;
            }
            else {
                newConfig[currConfigName] = currConfig;
            }
        }
        catch (err) {
            isReadError = true;
            console.error('Не удалось прочитать конфиг файл: ' + currFilePath + '. Ошибка: ' + err, 'parser');
        }
    }
    if (!isReadError) {
        if (newConfig && Object.keys(newConfig).length > 0) {
            // проверка, были ли изменения
            if (Object.keys(exports.config).length == 0 || !_.isEqual(exports.config, newConfig)) {
                exports.config = newConfig;
                // console.log('Загружена конфигурация сервиса: ' + JSON.stringify(exports.config));
                console.log('Загружена или обновлена конфигурация сервиса.');

                changeCallbacks.forEach(function(item, index, array) {
                    item();
                });
            }
        }
        if (newAuth) {
            // проверка, были ли изменения
            if (exports.auth == null || !_.isEqual(exports.auth, newAuth)) {
                exports.auth = newAuth;
                console.log('Загружены данные для аутентификации сервиса: ***');
            }
        }
    }

    // Определяем поддерживаемые языки
    if (exports.config.lang) {
        exports.langSupported = [];
        for(var p in exports.config.lang['E_DatabaseError']) {
            exports.langSupported.push(p);
        }
    }
}