import contactUsModel from "../../models/contact_us.model.js";
import demoRequestModel from "../../models/demo.model.js";
import logsModel from "../../models/logs.model.js";

export const readDemoRequest = async (filter, select = {}) => {
    try {
        const result = await demoRequestModel.find(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const readContactUs = async (filter, select = {}) => {
    try {
        const result = await contactUsModel.find(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const insertDemoRequest = async (insertData) => {
    try {
        try {
            const result = new demoRequestModel(insertData);
            await result.save();
            return result.toObject();
        } catch (error) {
            throw new Error(error);
        }
    } catch (error) {
        throw new Error(error);
    }
}

export const insertContactUs = async (insertData) => {
    try {
        try {
            const result = new contactUsModel(insertData);
            await result.save();
            return result.toObject();
        } catch (error) {
            throw new Error(error);
        }
    } catch (error) {
        throw new Error(error);
    }
}

export const insertLogs = async (insertData) => {
    try {
        const result = new logsModel(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
}