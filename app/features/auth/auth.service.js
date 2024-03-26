import businessProfileModel from "../../models/business_profile.model.js";
import customerModel from "../../models/customers.model.js"
import userModel from "../../models/users.model.js";

export const readCustomers = async (filter, select = {}) => {
    try {
        const result = await customerModel.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const readUsers = async (filter, select = {}) => {
    try {
        const result = await userModel.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const createCustomer = async (insertData) => {
    try {
        const result = new customerModel(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
}

export const createUser = async (insertData) => {
    try {
        const result = new userModel(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
}

export const updateCustomer = async (filter, updateData, select = {}) => {
    try {
        const result = await customerModel
            .findOneAndUpdate(filter, updateData, { new: true, runValidators: true })
            .lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const readAllCustomers = async (
    filter,
    select = { updatedAt: 0 },
    sort = { "createdAt": -1 },
    skip = 0,
    limit = 0,
) => {
    try {
        const result = await customerModel.aggregate([
            { $match: filter },
            { $project: select },
            { $sort: sort },
            { $skip: skip },
            { $limit: limit },
        ]);

        const count = await customerModel.aggregate([
            { $match: filter },
            { $count: "count" }
        ])
        return { result, count: count[0]?.count || 0 };
    } catch (error) {
        throw new Error(error);
    }
}

export const readAllUsers = async (
    filter,
    select = { _id: 1 },
    sort = {},
    skip = 0,
    limit = 0,
) => {
    try {
        const result = await userModel.aggregate([
            { $match: filter },
            { $project: select },
            { $sort: sort },
            { $skip: skip },
            { $limit: limit },
        ]);

        const count = await userModel.aggregate([
            { $match: filter },
            { $count: "count" }
        ])
        return { result, count: count[0]?.count || 0 };
    } catch (error) {
        throw new Error(error);
    }
}

export const readCustomerForDashboard = async () => {
    try {
        const FIRST_MONTH = 1;
        const LAST_MONTH = 12;
        const MONTHS_ARRAY = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        var currentDate = new Date();
        let START_DATE = new Date(currentDate.getFullYear(), 0, 1);
        let END_DATE = new Date(currentDate.getFullYear(), 11, 31);

        const result = await customerModel.aggregate([
            {
                $match: {
                    status: "active",
                    createdAt: { $gte: START_DATE, $lte: END_DATE }
                }
            },
            {
                $group: {
                    _id: { "year_month": { $substrCP: ["$createdAt", 0, 7] } },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year_month": 1 }
            },
            {
                $project: {
                    _id: 0,
                    count: 1,
                    month_year: {
                        $concat: [
                            { $arrayElemAt: [MONTHS_ARRAY, { $subtract: [{ $toInt: { $substrCP: ["$_id.year_month", 5, 2] } }, 1] }] },
                            "-",
                            { $substrCP: ["$_id.year_month", 0, 4] }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    data: { $push: { k: "$month_year", v: "$count" } }
                }
            },
            {
                $addFields: {
                    start_year: { $substrCP: [START_DATE, 0, 4] },
                    end_year: { $substrCP: [END_DATE, 0, 4] },
                    months1: { $range: [{ $toInt: { $substrCP: [START_DATE, 5, 2] } }, { $add: [LAST_MONTH, 1] }] },
                    months2: { $range: [FIRST_MONTH, { $add: [{ $toInt: { $substrCP: [END_DATE, 5, 2] } }, 1] }] }
                }
            },
            {
                $addFields: {
                    template_data: {
                        $concatArrays: [
                            {
                                $map: {
                                    input: "$months1", as: "m1",
                                    in: {
                                        count: 0,
                                        month_year: {
                                            $concat: [{ $arrayElemAt: [MONTHS_ARRAY, { $subtract: ["$$m1", 1] }] }, "-", "$start_year"]
                                        }
                                    }
                                }
                            },
                            {
                                $map: {
                                    input: "$months2", as: "m2",
                                    in: {
                                        count: 0,
                                        month_year: {
                                            $concat: [{ $arrayElemAt: [MONTHS_ARRAY, { $subtract: ["$$m2", 1] }] }, "-", "$end_year"]
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            },
            {
                $addFields: {
                    data: {
                        $map: {
                            input: "$template_data", as: "t",
                            in: {
                                k: "$$t.month_year",
                                v: {
                                    $reduce: {
                                        input: "$data", initialValue: 0,
                                        in: {
                                            $cond: [{ $eq: ["$$t.month_year", "$$this.k"] },
                                            { $add: ["$$this.v", "$$value"] },
                                            { $add: [0, "$$value"] }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    data: { $arrayToObject: "$data" },
                    _id: 0
                }
            }
        ]);

        return result;

    } catch (error) {
        throw new Error(error);
    }
}

export const readBusinessProfile = async (filter, select = {}) => {
    try {
        const result = await businessProfileModel.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const createBusinessProfile = async (insertData) => {
    try {
        const result = new businessProfileModel(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
}

export const updateBusinessProfile = async (filter, updateData, select = {}) => {
    try {
        const result = await businessProfileModel
            .findOneAndUpdate(filter, updateData, { new: true, runValidators: true })
            .lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};