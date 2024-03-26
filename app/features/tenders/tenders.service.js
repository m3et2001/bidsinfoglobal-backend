import tendersModel from "../../models/tenders.model.js";

export const readAllTenders = async (
    filter,
    select = { _id: 1 },
    sort = {},
    skip = 0,
    limit = 10,
    extra = null
) => {
    try {
        let pipeline = [
            { $match: filter },
            { $project: select },
            { $sort: sort },
            { $skip: skip },
            { $limit: limit },
        ]
        if (extra) {
            pipeline.push(extra);
        }
        const result = await tendersModel.aggregate(pipeline);

        const count = await tendersModel.aggregate([
            { $match: filter },
            { $count: "count" }
        ])
        return { result, count: count[0]?.count || 0 };
    } catch (error) {
        throw new Error(error);
    }
}

export const countTenders = async (filter) => {
    try {
        const count = await tendersModel.aggregate([
            { $match: filter },
            { $count: "tenders" }
        ])
        return count;
    } catch (error) {
        throw new Error(error);
    }
}

export const tendersCountBySector = async (array, select = {}) => {
    try {
        const result = await tendersModel.aggregate([
            {
                $match: { "sectors": { $in: array } }
            },
            {
                $group: {
                    _id: "$sectors",
                    count: {
                        $count: {}
                    }
                }
            }
        ]);
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const tendersCountByCpvCodes = async (array, select = {}) => {
    try {
        const result = await tendersModel.aggregate([
            {
                $match: { "cpvcodes": { $in: array } }
            },
            {
                $group: {
                    _id: "$cpvcodes",
                    count: {
                        $count: {}
                    }
                }
            }
        ]);
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const tendersCountByRegions = async (array, select = {}) => {
    try {
        const result = await tendersModel.aggregate([
            {
                $match: { "regions": { $in: array } }
            },
            {
                $group: {
                    _id: "$regions",
                    count: {
                        $count: {}
                    }
                }
            }
        ]);
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const readTenders = async (filter, select = {}) => {
    try {
        const result = await tendersModel.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const insertTenders = async (insertData) => {
    try {
        const result = new tendersModel(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
}

export const updateTenders = async (filter, updateData) => {
    try {
        const result = await tendersModel
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
