"use strict";

import dotenv from "dotenv";
dotenv.config();

import connectDB from "./app/config/db.config.js";
// import "./app/config/redis.config.js";

import rootRouter from "./app/routes/index.js";
import { responseSend } from "./app/helpers/responseSend.js";
import "./cronjob.js";

import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import bodyParser from "body-parser";

const __dirname = path.resolve();

const app = express();

const port = 5000;
const NODE_ENV = process.env.NODE_ENV;

app.use(cors());
app.use(express.json({limit: '100mb'}));
app.use(bodyParser.json({ limit: '100mb' }))
connectDB();

// test if working
app.use("/test", (req, res) => res.send("working"));

if (NODE_ENV === "development" || NODE_ENV === "local") {
    app.use(morgan("dev"));
}

app.use("/", rootRouter);

app.use('/public', express.static(__dirname + '/public'));

//for errors
app.use((error, req, res, next) => {
    if (!error) {
        return next();
    }
    return responseSend(res, 400, error.message);
});

app.listen(port, () => {
    console.log("== Server running on Port ==", port);
});
