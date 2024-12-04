import contractAwardModel from "../../models/contract_award.model.js";

export const readAllContractAward = async (
    filter,
    select = { _id: 1 },
    sort = {},
    skip = 0,
    limit = 0,
) => {
    try {
        const result = await contractAwardModel.aggregate([
            { $match: filter },
            { $project: select },
            { $sort: sort },
            { $skip: skip },
            { $limit: limit },
        ]);

        const count = await contractAwardModel.aggregate([
            { $match: filter },
            { $count: "count" }
        ])
        const query = [
            { $match: filter },
            { $project: select },
            { $sort: sort },
            { $skip: skip },
            { $limit: limit },
        ]
        return { result, count: count[0]?.count || 0, query };
    } catch (error) {
        throw new Error(error);
    }
}

export const countContracts = async (filter) => {
    try {
        const count = await contractAwardModel.aggregate([
            { $match: filter },
            { $count: "contracts" }
        ])
        return count;
    } catch (error) {
        throw new Error(error);
    }
}
export const readContractAward = async (filter, select = {}) => {
    try {
        const result = await contractAwardModel.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const insertContractAward = async (insertData) => {
    try {
        const result = new contractAwardModel(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
}

export const updateContractAward = async (filter, updateData) => {
    try {
        const result = await contractAwardModel
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
