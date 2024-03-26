import cmsModel from "../../models/cms.model.js"

export const readCmsRecord = async (filter, select = {}) => {
    try {
        const result = await cmsModel.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}


export const updateCmsRecords = async (filter, updateData, select = {}) => {
    try {
        const result = await cmsModel
            .findOneAndUpdate(filter, updateData, {
                new: true,
                runValidators: true,
            })
            .select(select)
            .lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const pushDataInCMS = async (filter, insertData, select = {}) => {
    try {
        const result = await cmsModel
            .findOneAndUpdate(
                filter,
                {
                    $push: insertData,
                },
                {
                    new: true,
                }
            )
            .select(select)
            .lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const removeDataInCMS = async (filter, updateData, select = {}) => {
    try {
        const result = await cmsModel
            .findOneAndUpdate(
                filter,
                {
                    $pull: updateData
                },
                {
                    new: true
                }
            )
            .select(select)
            .lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const updateDataInCMS = async (filter, updateData, arrayFilters, select = {}) => {
    try {
        const result = await cmsModel
            .findOneAndUpdate(
                filter,
                {
                    $set: updateData,
                },
                {
                    arrayFilters: arrayFilters,
                    new: true
                }
            )
            .select(select)
            .lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};