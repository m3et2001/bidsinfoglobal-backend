import tendersModel from "../../models/tenders.model.js";
import moment from "moment";


export const readAllTenders = async (
  filter,
  select = { _id: 1 },
  sort = {},
  skip = 0,
  limit = 10,
  extra = null
) => {
  try {
    let currentDate = new Date();
    let oneDayAgo = new Date();
    oneDayAgo.setDate(currentDate.getDate() - 1);
    let validDatePattern = /^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/; // Valid date pattern

    let pipeline = [

      { $match: filter },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
      { $project: select }
    ];

    const dateMatch = {
      $match: {
        $expr: {
          $regexMatch: { input: "$closing_date", regex: validDatePattern }
        }
      }
    }
    const addDate =
    {
      $addFields: {
        parsedClosingDate: {
          $cond: {
            if: { $regexMatch: { input: "$closing_date", regex: validDatePattern } },
            then: { $dateFromString: { dateString: "$closing_date", format: "%Y/%m/%d" } },
            else: "-" // Handle invalid date formats
          }
        }
      }
    }
    let condition
    let sliceCount = 1
    //     // Apply conditions based on tender_type
    if (filter.tender_type === "Live") {
      condition = {
        $match: {
          parsedClosingDate: { $gte: oneDayAgo }// Ensure we only process valid dates
        }
      }
    } else if (filter.tender_type === "Archive") {
      condition = {
        $match: {
          parsedClosingDate: { $lt: oneDayAgo } // Ensure we only process valid dates
        }
      }

    }

    if (extra) {
      pipeline.push(extra);
    }
    if (filter?.tender_type) {
      pipeline.splice(0, 0, dateMatch, addDate, condition);
      sliceCount += 3

      delete filter.tender_type
    }
    // Execute the aggregation query
    const result = await tendersModel.aggregate(pipeline, { allowDiskUse: true })
    // Counting total results
    const countPipeline = [
      ...pipeline.slice(0, sliceCount),
      { $count: "count" }
    ];
    const countResult = await tendersModel.aggregate(countPipeline, { allowDiskUse: true })
    const count = countResult[0]?.count || 0;
    const query = pipeline

    return { result, count,query };
  } catch (error) {
    console.error("Error in readAllTenders:", error);
    throw new Error(error);
  }
};





export const countTenders = async (filter) => {
  try {
    const count = await tendersModel.aggregate([
      { $match: filter },
      { $count: "tenders" },
    ]);
    return count;
  } catch (error) {
    throw new Error(error);
  }
};

export const tendersCountBySector = async (array, select = {}) => {
  try {
    const result = await tendersModel.aggregate([
      {
        $match: { sectors: { $in: array } },
      },
      {
        $group: {
          _id: "$sectors",
          count: {
            $count: {},
          },
        },
      },
    ]);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const tendersCountByCpvCodes = async (array, select = {}) => {
  try {
    const result = await tendersModel.aggregate([
      {
        $match: { cpvcodes: { $in: array } },
      },
      {
        $group: {
          _id: "$cpvcodes",
          count: {
            $count: {},
          },
        },
      },
    ]);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const tendersCountByRegions = async (array, select = {}) => {
  try {
    const result = await tendersModel.aggregate([
      {
        $match: { regions: { $in: array } },
      },
      {
        $group: {
          _id: "$regions",
          count: {
            $count: {},
          },
        },
      },
    ]);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const readTenders = async (filter, select = {}) => {
  try {
    const result = await tendersModel.findOne(filter).select(select).lean();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const insertTenders = async (insertData) => {
  try {
    const result = new tendersModel(insertData);
    await result.save();
    return result.toObject();
  } catch (error) {
    throw new Error(error);
  }
};

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
};
