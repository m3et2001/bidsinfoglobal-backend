import projectsModel from "../../models/projects.model.js";

export const readAllProjects = async (
    filter,
    select = { _id: 1 },
    sort = {},
    skip = 0,
    limit = 0,
) => {
    try {
        const result = await projectsModel.aggregate([
            { $match: filter },
            { $project: select },
            { $sort: sort },
            { $skip: skip },
            { $limit: limit },
        ]);

        const count = await projectsModel.aggregate([
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
export const countProjects = async (filter) => {
    try {
        const count = await projectsModel.aggregate([
            { $match: filter },
            { $count: "projects" }
        ])
        return count;
    } catch (error) {
        throw new Error(error);
    }
}
export const readProjects = async (filter, select = {}) => {
    try {
        const result = await projectsModel.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const insertProjects = async (insertData) => {
    try {
        const result = new projectsModel(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
}

export const updateProjects = async (filter, updateData) => {
    try {
        const result = await projectsModel
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

export const projectsCountByRegions = async (array, select = {}) => {
    try {
        const result = await projectsModel.aggregate([
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

export const projectsCountBySectors = async (array, select = {}) => {
    try {
        const result = await projectsModel.aggregate([
            {
                $match: { "sector": { $in: array } }
            },
            {
                $group: {
                    _id: "$sector",
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