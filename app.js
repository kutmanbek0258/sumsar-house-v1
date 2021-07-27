'use strict'

const express    = require('express');
const app        = express();
const router     = express.Router();
const bodyParser = require('body-parser');
const logger 	   = require('morgan');
const mongoose = require('mongoose');
const port 	   = process.env.PORT || 8088;
const routes   = require("./routes");
const userRoutes = require("./routes/user.routes")

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

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));
app.use(logger('dev'));

routes(app)

app.set('view engine', 'pug');
app.set("views", "views");

app.use(express.static(__dirname + '/public'));

app.listen(port);

console.log(`App Runs on ${port}`);