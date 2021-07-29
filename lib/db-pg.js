var config = require('./util-config.js');
var log = require('./util-log.js');
var moment = require('moment');
const { Pool, Client } = require('pg');
var msg = require('./util-messages.js');

exports.ready = false;
exports.dbClient = null;
exports.dbConfig = null;
exports.dbPool = null;
exports.reconectTimer = null;

exports.init = async function() {
    return new Promise(async (resolve, reject) => {
        try {
            log.trace("Запуск инициализации модуля работы с основной БД Postgres");

            exports.dbConfig = {
                user: config.config.main.rpDbUser,
                database: config.config.main.rpDbName,
                password: config.config.main.rpDbPass,
                host: config.config.main.rpDbHost,
                port: config.config.main.rpDbPort,
                max: config.config.main.rpDbPoolSize,
                connectionTimeoutMillis: 5000,
                idleTimeoutMillis: config.config.main.rpDbIdleTimeoutSec * 1000
            }

            log.debug("Параметры подключения к БД Postgres: " + config.config.main.rpDbHost + ":" + config.config.main.rpDbPort + "/" + config.config.main.rpDbName + ". Пользователь: " + config.config.main.rpDbUser);

            exports.dbPool = new Pool(exports.dbConfig);

            exports.dbPool.on('error', (err, client) => {
                if (exports.ready) {
                    log.error("Ошибка подключения к БД Postgres. Сервис остановил обработку запросов", err);
                    exports.ready = false;
                    // setTimeout(initConnect, 2000);
                    if (exports.reconectTimer == null) {
                        exports.reconectTimer = setInterval(initConnect, 8000);
                    }
                }
            });

            exports.dbPool.on('connect', (err, client) => {
                if (!exports.ready) {
                    log.info("Успешное подключение к БД Postgres. Сервис начинает обработку запросов");
                    
                    if (exports.reconectTimer) {
                        clearInterval(exports.reconectTimer);
                        exports.reconectTimer = null;
                    }

                    exports.ready = true;
                }
            });


            await patchDbSync();

            initConnect(function(err) {
                if (err) {
                    log.error("Инициализация модуля работы с БД Postgres завершена с ошибкой", err);
                    reject(err);
                } else {
                    log.debug("Инициализация модуля работы с БД Postgres завершена успешно");
                    exports.ready = true;
                    resolve();
                }
            });
            
        } catch (err) {
            log.error("Инициализация модуля работы с БД Postgres завершена с ошибкой", err);
            reject(err);
        }
    });
}

patchDbSync = function() {
    return new Promise((resolve, reject) => {
        patchDb(function(err, data) {
            if(err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

async function patchDb(callback) {
    // Патч БД

    log.trace("Проверка объектов БД Postgres");

    ////////////////
    // Создание таблицы images
    /*
    var q = `
        create table if not exists images
        (
            imag_id          serial      not null
                constraint imag_pk
                    primary key,
            imag_file_name  varchar(100) not null,
            imag_updated    timestamp
        );
    `
    var qParams=[];

    try {
        await exports.execSync(q, qParams);
    } catch (err) {
        var errMsg = 'Ошибка при патче БД. Запрос; ' + q + '. Ошибка: ' + JSON.stringify(err);
        log.error(errMsg);
        callback(errMsg);
        return;
    }

    q = `create unique index if not exists imag_file_name_uindex on images (imag_file_name)`;
    var qParams=[];

    try {
        await exports.execSync(q, qParams);
    } catch (err) {
        var errMsg = 'Ошибка при патче БД. Запрос; ' + q + '. Ошибка: ' + JSON.stringify(err);
        log.error(errMsg);
        callback(errMsg);
        return;
    }
    */

    callback(null);
}

function initConnect(callback) {

    if (exports.reconectTimer) {
        log.info('Попытка подключения к БД после отключения');
    }

    exports.dbPool.connect(function(err, client) {
        if (err) {
            log.error("Ошибка при подключении к БД", err);
            if (callback) callback(err);
            return;
        }

        client.query('select now();', '', function(err,res) {
            if (err) {
                client.release();
                if (callback) callback(err);
                return;
            }
            log.debug("Успешный проверочный запрос 'select now();' из БД Postgres: " + res.rows[0].now);
            client.release();
            if (callback) callback();
        });
    });
}

exports.execSync = function(sql, params, noTrace=false, refId=null) {
    return new Promise((resolve, reject) => {
        exports.exec(sql, params, function(err, data) {
            if(err) {
                reject(err);
            } else {
                resolve(data);
            }
        }, noTrace, refId);
    });
}

exports.exec = function(sql, params, callback, noTrace=false, refId=null) {

    if (config.isShutdown) {
        callback(log.error("Выполняется остановка приложения. Выполнение запроса отменено.", null, refId));
        return;
    }
    
    if (!sql) {
        callback(log.error("В функцию rpdb.exec передан пустой запрос в БД.", null, refId));
        return;
    }

    exports.dbPool.connect(function(err, client, poolRelease) {
        if (err) {
            if (callback) callback(log.error("Ошибка при подключении к БД.", err, refId));
            return;
        }

        client.query(sql, params, 
            function(err,res) {
                if (err) {

                    var logRec = {
                        code: 'E_DatabaseError',
                        error: 'Ошибка выполнения запроса в БД',
                        debug: 'Запрос: ' + sql + ". Параметры запроса: " + JSON.stringify(params),
                        sysErr: err,
                        refId: refId,
                    }

                    client.release();
                    if (callback) callback(log.rec(logRec));
                    return;
                }

                client.release();

                var r = null;
                var rlen = 0;
                if (res && res.rows) {
                    r = res.rows;
                    rlen = res.rows.length;
                } else {
                    r = res;
                }
                if (!noTrace) {
                    log.trace("Выполнен запрос в БД Postgres: " + sql + ". Параметры запроса: " + JSON.stringify(params) + ". Количество записей в ответе: " + rlen, refId);
                }
                if (callback) callback(null, r);
        });
    });
}