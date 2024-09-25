"use strict";

import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        
        const mongo = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        mongoose.set("debug",true)
        console.log("== Connected To MongoDB ===", mongo.connection.host);
        return mongo;
    } catch (error) {
        console.log("🚀 ~ file: db.js ~ line 12 ~ connectDB ~ error", error);
    }
};

export default connectDB;
