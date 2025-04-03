if(process.env.NODE_ENV !== "production"){
  require('dotenv').config()
}

const express = require("express");
const cors = require("cors");
const path = require('path');
const UserRouter = require("./routes/user");
// const connectMongoDb = require("./connections");
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const mongoose = require('mongoose');
const serviceAccount = require('./nexus-beings-firebase-adminsdk-dfb6p-003daac05e.json');
const dbUrl = process.env.DB_URL
const app = express();

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("Database connected");
});

const allowedOrigins = [];  // add all the external server links

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error(origin));
        }
    }
}));

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.use("/", UserRouter);

app.listen(5000, "0.0.0.0", () => {
  console.log("started");
});
