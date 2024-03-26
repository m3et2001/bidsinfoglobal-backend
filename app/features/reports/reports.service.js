import reportsModel from "../../models/reports.model.js"

export const createReports = async (insertData) => {
    try {
        const result = new reportsModel(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
}

export const readAllReports = async (
    filter,
    select = { _id: 1 },
    sort = {},
    skip = 0,
    limit = 0,
) => {
    try {
        const result = await reportsModel.aggregate([
            { $match: filter },
            { $project: select },
            { $sort: sort },
            { $skip: skip },
            { $limit: limit },
        ]);

        const count = await reportsModel.aggregate([
            { $match: filter },
            { $count: "count" }
        ])
        return { result, count: count[0]?.count || 0 };
    } catch (error) {
        throw new Error(error);
    }
}