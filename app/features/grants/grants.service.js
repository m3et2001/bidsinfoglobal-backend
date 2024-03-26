import grantsModel from "../../models/grants.model.js";

export const readAllGrants = async (
    filter,
    select = { _id: 1 },
    sort = {},
    skip = 0,
    limit = 0,
) => {
    try {
        const result = await grantsModel.aggregate([
            { $match: filter },
            { $project: select },
            { $sort: sort },
            { $skip: skip },
            { $limit: limit },
        ]);

        const count = await grantsModel.aggregate([
            { $match: filter },
            { $count: "count" }
        ])
        return { result, count: count[0]?.count || 0 };
    } catch (error) {
        throw new Error(error);
    }
}

export const countGrants = async (filter) => {
    try {
        const count = await grantsModel.aggregate([
            { $match: filter },
            { $count: "grants" }
        ])
        return count;
    } catch (error) {
        throw new Error(error);
    }
}

export const readGrants = async (filter, select = {}) => {
    try {
        const result = await grantsModel.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const insertGrants = async (insertData) => {
    try {
        const result = new grantsModel(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
}

export const updateGrants = async (filter, updateData) => {
    try {
        const result = await grantsModel
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
