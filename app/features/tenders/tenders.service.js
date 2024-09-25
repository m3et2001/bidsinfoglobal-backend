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
      { $project: select },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit }
    ];
    console.log(sort, pipeline, "sssssssssssssssssssssssssssssss")

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
    //     // Apply conditions based on tender_type
    if (filter.tender_type === "Live") {
      // pipeline[2].$match = {
      //   parsedClosingDate: { $gte: oneDayAgo } // Live tenders: Closing date in the future or today
      // };
       condition = {
        $match: {
          parsedClosingDate: { $gte: oneDayAgo }// Ensure we only process valid dates
        }
      }
    } else if (filter.tender_type === "Archive") {
      // pipeline[2].$match = {
      //   parsedClosingDate: { $lt: oneDayAgo } // Archive tenders: Closing date in the past
      // };
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
      pipeline.splice(0, 0, dateMatch, addDate,condition);

      delete filter.tender_type
    }
    // Execute the aggregation query
    const result = await tendersModel.aggregate(pipeline);

    // Counting total results
    const countPipeline = [
      ...pipeline.slice(0, 3),
      { $count: "count" }
    ];
    const countResult = await tendersModel.aggregate(countPipeline);
    const count = countResult[0]?.count || 0;

    return { result, count };
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
