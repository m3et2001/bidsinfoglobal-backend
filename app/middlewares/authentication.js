import jwt from "jsonwebtoken";
import { responseSend } from "../helpers/responseSend.js";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const EON_JWT_SECRET = process.env.EON_JWT_SECRET;

const authenticateUser = async (req, res, next) => {
    try {
        const access_token = req.header("Authorization");
        if (!access_token) throw new Error("No token, authorization denied");

        const token = access_token.split(" ")[1];

        req.session = jwt.verify(token, JWT_SECRET);
        next();
    } catch (e) {
        responseSend(
            res,
            403,
            "Unresolved Authentication error: " + e.message,
            null
        );
    }
};

const addAuthUserIfExist = async (req, res, next) => {
    try {
        const access_token = req.header("Authorization");

        if (access_token) {
            const token = access_token.split(" ")[1];
            req.session = jwt.verify(token, JWT_SECRET);
        }
        next();
    } catch (e) {
        next();
    }
}

const validateKey = async (req, res, next) => {
    try {
        const apikey = req.header("api-key");
        if (!apikey) throw new Error("apiKey is missing in headers");

        if (apikey !== process.env.EON_API_KEY) throw new Error("Request not allowed, apiKey is invalid.");

        next();
    } catch (e) {
        responseSend(
            res,
            403,
            e.message,
            null
        );
    }
}

const decodeEonToken = async (req, res, next) => {
    try {
        const eontoken = req.body.eontoken;
        if (!eontoken) throw new Error("eontoken is missing in body");

        req.session = jwt.verify(eontoken, EON_JWT_SECRET);
        next();
    } catch (e) {
        responseSend(
            res,
            403,
            e.message,
            null
        );
    }
}

export { authenticateUser, addAuthUserIfExist, validateKey, decodeEonToken };
