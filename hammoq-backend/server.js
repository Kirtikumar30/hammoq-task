const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 4000;
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
let User = require("./router/user.route");
var fs = require("fs");
const constant = require('./common/constant');
var static = require("serve-static");
var path = require("path");

/*
create express app
*/
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
});
app.use(static(path.join(__dirname, "public")));
app.use(express.static("public"));
app.use(
    "/uploaded_documents",
    express.static(path.join(__dirname, "/uploaded_documents"))
);

/*
configuration of database
*/
const database = require('./config/database');
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);

/*
connecting to database
*/
mongoose.connect(database.DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
}).then(
    () => { console.log('Database is connected') },
    err => { console.log('Can not connect to the database' + err) }
);
app.use('/User', User);

const dir = '../hammoq/uploaded_documents';
if (!fs.existsSync(constant.FOLDER_USER_IMG)) {
    fs.mkdirSync(constant.FOLDER_USER_IMG, {
        recursive: true
    });
}
app.listen(PORT, '0.0.0.0', function () {
    console.log("Server is running on Port: " + PORT);
});