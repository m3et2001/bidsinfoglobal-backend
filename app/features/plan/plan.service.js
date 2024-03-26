import planModel from "../../models/plan.model.js";
import planHistoryModel from "../../models/plan_history.js";
import planRequestModel from "../../models/plan_request.js";


export const readPlans = async (filter, select = {}) => {
    try {
        const result = await planModel.find(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const readPlan = async (filter, select = {}) => {
    try {
        const result = await planModel.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const createPlanHistory = async (insertData) => {
    try {
        const result = new planHistoryModel(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
}

export const createPlanRequest = async (insertData) => {
    try {
        const result = new planRequestModel(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
}

export const readPlanRequest = async (filter, select = {}) => {
    try {
        const result = await planRequestModel.find(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const readPlanRequestSingle = async (filter, select = {}) => {
    try {
        const result = await planRequestModel.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}
export const updatePlanRequest = async (filter, updateData, select = {}) => {
    try {
        const result = await planRequestModel
            .findOneAndUpdate(filter, updateData, { new: true, runValidators: true })
            .lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};