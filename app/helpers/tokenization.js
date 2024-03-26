import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const generateSession = async (accessTokenData, accessTokenOptions = { expiresIn: "2 days" }) => {
    const access_token = jwt.sign(accessTokenData, JWT_SECRET, accessTokenOptions);
    return access_token;
}