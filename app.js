'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const port = process.env.PORT || 8088;
const routes = require('./src/routes');
const config = require('./src/config/config.json');
const fs = require('fs');
const path = require('path');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/u_rent', {
    useMongoClient: true
});

// try{
//     mongoose.connect('mongodb://127.0.0.1:27017/u_rent', {
//         useMongoClient: true,
//         'auth': { 'authSource': 'admin' },
//         'user': 'admin',
//         'pass': 'password'
//     });
// }catch (error){
//     console.log(error);
// }

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }));

if(config.log_mode === 'file'){
    app.use(logger(config.log_level, { stream: accessLogStream }));
}else if(config.log_mode === 'console'){
    app.use(logger(config.log_level));
}

routes(app);

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(express.static(__dirname + '/public'));

app.listen(port);

console.log(`App Runs on ${port}`);