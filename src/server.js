import express from "express";
import bodyParser from "body-parser";
import http from 'http';
import configViewEngine from "./config/viewEngine";
import initApiRoutes from "./routes/api";
import connectDatabase from "./config/connectDatabase";
import initSocket from './socket/index';

require("dotenv").config();

let app = express();
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", process.env.FRONT_END_URL);

    // Request methods you wish to allow
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);

    // Pass to next layer of middleware
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

configViewEngine(app);
initApiRoutes(app);

connectDatabase();

let port = process.env.PORT || 1000;

const server = http.createServer(app);

const io = initSocket(server);


server.listen(port, () => {
    console.log("Backend bdraw is running on the port: " + port);
});