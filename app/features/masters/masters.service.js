import countryModel from "../../models/country.model.js";
import statesModel from "../../models/states.model.js";
import regionsModel from "../../models/regions.model.js";
import sectorsModel from "../../models/sectors.model.js";
import cpvCodesModel from "../../models/cpv_codes.model.js";
import fundingAgencyModel from "../../models/funding_agency.model.js";

// country master service
export const readAllCountry = async (
    filter,
    select = {},
    sort = {},
    skip = 0,
    limit = 0,
) => {
    try {

        const result = await countryModel.aggregate([
            { $match: filter },
            { $project: select },
            { $sort: sort },
            { $skip: skip },
            { $limit: limit },
        ]);

        const count = await countryModel.aggregate([
            { $match: filter },
            { $count: "count" }
        ])

        return { result, count: count?.[0]?.count || 0 };
    } catch (error) {
        throw new Error(error);
    }
}

export const readCountry = async (filter, select = {}) => {
    try {
        const result = await countryModel.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const insertCountry = async (insertData) => {
    try {
        const result = new countryModel(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
}

export const updateCountry = async (filter, updateData) => {
    try {
        const result = await countryModel
            .findOneAndUpdate(filter, updateData, {
                new: true,
                runValidators: true,
            })
            .lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

// state master service

export const readAllStates = async (
    filter,
    select = {},
    sort = {},
    skip = 0,
    limit = 0,
) => {
    try {

        const result = await statesModel.aggregate([
            { $match: filter },
            { $project: select },
            { $sort: sort },
            { $skip: skip },
            { $limit: limit },
        ]);

        const count = await statesModel.aggregate([
            { $match: filter },
            { $count: "count" }
        ])

        return { result, count: count[0]?.count || 0 };
    } catch (error) {
        throw new Error(error);
    }
}

export const readStates = async (filter, select = {}) => {
    try {
        const result = await statesModel.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const insertStates = async (insertData) => {
    try {
        const result = new statesModel(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
}

export const updateStates = async (filter, updateData) => {
    try {
        const result = await statesModel
            .findOneAndUpdate(filter, updateData, {
                new: true,
                runValidators: true,
            })
            .lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

// regions master service

export const readAllRegions = async (
    filter,
    select = {},
    sort = {},
    skip = 0,
    limit = 0,
) => {
    try {

        const result = await regionsModel.aggregate([
            { $match: filter },
            { $project: select },
            { $sort: sort },
            { $skip: skip },
            { $limit: limit },
        ]);

        const count = await regionsModel.aggregate([
            { $match: filter },
            { $count: "count" }
        ])

        return { result, count: count[0]?.count || 0 };
    } catch (error) {
        throw new Error(error);
    }
}

export const readRegions = async (filter, select = {}) => {
    try {
        const result = await regionsModel.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const insertRegions = async (insertData) => {
    try {
        const result = new regionsModel(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
}

export const updateRegions = async (filter, updateData) => {
    try {
        const result = await regionsModel
            .findOneAndUpdate(filter, updateData, {
                new: true,
                runValidators: true,
            })
            .lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

// sectors master service

export const readAllSectors = async (
    filter,
    select = {},
    sort = {},
    skip = 0,
    limit = 10,
) => {
    try {

        const result = await sectorsModel.aggregate([
            { $match: filter },
            { $project: select },
            { $sort: sort },
            { $skip: skip },
            { $limit: limit },
        ]);

        const count = await sectorsModel.aggregate([
            { $match: filter },
            { $count: "count" }
        ])

        return { result, count: count[0]?.count || 0 };
    } catch (error) {
        throw new Error(error);
    }
}

export const readSectors = async (filter, select = {}) => {
    try {
        const result = await sectorsModel.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const insertSectors = async (insertData) => {
    try {
        const result = new sectorsModel(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
}

export const updateSectors = async (filter, updateData) => {
    try {
        const result = await sectorsModel
            .findOneAndUpdate(filter, updateData, {
                new: true,
                runValidators: true,
            })
            .lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

// cpv codes master service

export const readAllCPVCodes = async (
    filter,
    select = {},
    sort = {},
    skip = 0,
    limit = 0,
) => {
    try {

        const result = await cpvCodesModel.aggregate([
            { $match: filter },
            { $project: select },
            { $sort: sort },
            { $skip: skip },
            { $limit: limit },
        ]);

        const count = await cpvCodesModel.aggregate([
            { $match: filter },
            { $count: "count" }
        ])

        return { result, count: count[0]?.count || 0 };
    } catch (error) {
        throw new Error(error);
    }
}

export const readCPVCodes = async (filter, select = {}) => {
    try {
        const result = await cpvCodesModel.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const insertCPVCodes = async (insertData) => {
    try {
        const result = new cpvCodesModel(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
}

export const updateCPVCodes = async (filter, updateData) => {
    try {
        const result = await cpvCodesModel
            .findOneAndUpdate(filter, updateData, {
                new: true,
                runValidators: true,
            })
            .lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

// funding agency master service

export const readAllFundingAgency = async (
    filter,
    select = {},
    sort = {},
    skip = 0,
    limit = 0,
) => {
    try {

        const result = await fundingAgencyModel.aggregate([
            { $match: filter },
            { $project: select },
            { $sort: sort },
            { $skip: skip },
            { $limit: limit },
        ]);

        const count = await fundingAgencyModel.aggregate([
            { $match: filter },
            { $count: "count" }
        ])

        return { result, count: count[0]?.count || 0 };
    } catch (error) {
        throw new Error(error);
    }
}

export const readFundingAgency = async (filter, select = {}) => {
    try {
        const result = await fundingAgencyModel.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const insertFundingAgency = async (insertData) => {
    try {
        const result = new fundingAgencyModel(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
}

export const updateFundingAgency = async (filter, updateData) => {
    try {
        const result = await fundingAgencyModel
            .findOneAndUpdate(filter, updateData, {
                new: true,
                runValidators: true,
            })
            .lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}