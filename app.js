'use strict'

const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const logger 	   = require('morgan');
const mongoose = require('mongoose');
const port 	   = process.env.PORT || 8088;
const routes   = require("./routes");
const pgdb = require("./lib/db-pg");
const config = require("./lib/util-config");
const log = require("./lib/util-log");

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/u_rent', {
    useMongoClient: true
});
/*mongoose.connect('mongodb://127.0.0.1:27017/u_rent', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    "auth": { "authSource": "admin" },
    "user": "admin",
    "pass": "myadminpassword"
});*/

(async () => {
    try {
        await config.init();
        await log.init();
        await pgdb.init();

        const q = "SELECT _id, description, link, latitude, longitude,\n" +
            "       ACOS( SIN( PI() * $1 / 180.0) *\n" +
            "             SIN(PI() * banners.latitude / 180.0) +\n" +
            "             COS(PI() * $1 / 180.0) *\n" +
            "             COS(PI() * banners.latitude / 180.0) *\n" +
            "             COS(PI() * banners.longitude / 180.0-PI() * $2 / 180.0)) * 6371\n" +
            "AS distance FROM banners ORDER BY distance;"
        const params = [42.8889713,74.6049057]

        const data = await pgdb.execSync(q, params, false, null);

        console.log(data)

    } catch (err) {
        console.log("Ошибка при инициализации сервиса: " + (err.stack || err));
    }
})();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));
app.use(logger('dev'));

routes(app)

app.set('view engine', 'pug');
app.set("views", "views");

app.use(express.static(__dirname + '/public'));

app.listen(port);

console.log(`App Runs on ${port}`);