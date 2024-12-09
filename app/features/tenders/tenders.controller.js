"use strict";

import { differenceInSeconds, formatISO } from "date-fns";
import { isSuperAdmin } from "../../helpers/common.js";
import { responseSend } from "../../helpers/responseSend.js";
import {
  insertTenders,
  readAllTenders,
  readTenders,
  updateTenders,
} from "./tenders.service.js";
import { readCustomers } from "../auth/auth.service.js";
import tendersModel from "../../models/tenders.model.js";
import { searchType } from "../../helpers/constance.js";
import { startingBigRefNo } from "../../helpers/constance.js";

function convertToQueryObject(queryString) {
  // List of MongoDB comparison operators for dates
  const dateOperators = ['$gte', '$lte', '$gt', '$lt', '$eq', '$ne'];

  return JSON.parse(queryString, (key, value) => {
      // Handle regex patterns
      if (typeof value === 'string') {
          const regexMatch = value.match(/^\/(.*?)\/([gimsuy]*)$/);
          if (regexMatch) {
              // Convert string that looks like a regex to RegExp object
              return new RegExp(regexMatch[1], regexMatch[2]);
          }

          // Check if the current context should trigger date conversion
          if (dateOperators.includes(key) && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)) {
              // Convert ISO 8601 date strings to JavaScript Date objects
              return new Date(value);
          }
      }
      return value;
  });
}





const tenders_list = {
  title: 1,
  sectors: 1,
  country: 1,
  big_ref_no: 1,
  description: 1,
  published_date: 1,
  closing_date: 1,
  cpv_codes: 1,
  createdAt: 1,
};

export const tenders_all_field = {
  title: 1,
  authority_name: 1,
  sectors: 1,
  cpv_codes: 1,
  regions: 1,
  address: 1,
  telephone: 1,
  fax_number: 1,
  email: 1,
  contact_person: 1,
  big_ref_no: 1,
  description: 1,
  tender_type: 1,
  tender_no: 1,
  funding_agency: 1,
  tender_competition: 1,
  published_date: 1,
  closing_date: 1,
  country: 1,
  emd: 1,
  estimated_cost: 1,
  documents: 1,
  is_active: 1,
  is_active: 1,
  createdAt: 1,
};

const tenders_limit_field = {
  title: 1,
  description: 1,
  published_date: 1,
  closing_date: 1,
  country: 1,
  emd: 1,
  estimated_cost: 1,
  documents: 1,
  sectors: 1,
  cpv_codes: 1,
  regions: 1,
  createdAt: 1,
};

export const tendersAllList = async (req, res, next) => {
  try {
    var {
      keywords,
      pageNo,
      limit,
      sortBy,
      sortField,
      cpv_codes,
      sectors,
      regions,
      location,
      funding_agency,
      search_type,
      extraFilter = null,
      search_type_filter = null,
      raw_query,
      query_type,
      from_date = null,
      to_date = null,
      country = null,
      exclude_words = null,
    } = req.query;
    if (query_type === "raw_query") {
      const pipeline = convertToQueryObject(raw_query)
      const result = await tendersModel.aggregate(pipeline, { allowDiskUse: true })
      // Counting total results
      let sliceCount = 1

      const countPipeline = [
        ...pipeline.slice(0, sliceCount),
        { $count: "count" }
      ];
      const countResult = await tendersModel.aggregate(countPipeline, { allowDiskUse: true })
      const count = countResult[0]?.count || 0;
      const query = pipeline

      const re = { result, count, query }
      responseSend(res, 201, "Tenders records", { ...re, ...req.query });

    }
    else {

      let filter = { is_active: true, is_deleted: false };
      let select = tenders_list;
      let orAdvCon = []
      let orCon = []
      let keywordsList = keywords ? keywords.split(',').map(kw => kw.trim()) : [];

      let condition = 0;
      if (keywords && exclude_words) {
        condition = 1; // Both keywords and exclude_words exist
      } else if (keywords) {
        condition = 2; // Only keywords exist
      } else if (exclude_words) {
        condition = 3; // Only exclude_words exist
      }

      if (search_type === searchType.EXACT) {

        switch (condition) {
          case 1:
            // Both keywords and exclude_words exist
            orAdvCon.push({
              $and: [
                {
                  $or: [
                    { "description": { $regex: new RegExp(keywords.trim()), $options: "m" } },
                    { "title": { $regex: new RegExp(keywords.trim()), $options: "m" } }
                  ]
                },
                {
                  $and: [
                    { "description": { $not: { $regex: new RegExp(exclude_words.trim()), $options: "m" } } },
                    { "title": { $not: { $regex: new RegExp(exclude_words.trim()), $options: "m" } } }
                  ]
                }
              ]
            });
            break;

          case 2:
            // Only keywords exist
            orAdvCon.push({
              $and: [
                {
                  $or: [
                    { "description": { $regex: new RegExp(keywords.trim()), $options: "m" } },
                    { "title": { $regex: new RegExp(keywords.trim()), $options: "m" } }
                  ]
                }
              ]
            });
            console.log(JSON.stringify(orAdvCon), "Keywords case");
            break;

          case 3:
            // Only exclude_words exist
            orAdvCon.push({
              $and: [
                {
                  $and: [
                    { "description": { $not: { $regex: new RegExp(exclude_words.trim()), $options: "m" } } },
                    { "title": { $not: { $regex: new RegExp(exclude_words.trim()), $options: "m" } } }
                  ]
                }
              ]
            });
            console.log(JSON.stringify(orAdvCon), "Exclude words case");
            break;

          default:
            console.log("No keywords or exclude_words provided.");
        }

      } else if (search_type === searchType.RELEVENT) {
        let excludeWordsList = exclude_words ? exclude_words.split(',').map(ew => ew.trim()) : [];
        switch (condition) {
          case 1:
            // Both keywords and exclude_words exist
            let keywordConditions = [];
            for (let ele of keywordsList) {
              keywordConditions.push({ "description": { $regex: new RegExp(ele), $options: "m" } });
              keywordConditions.push({ "title": { $regex: new RegExp(ele), $options: "m" } });
            }

            let excludeConditions = [];
            for (let ele of excludeWordsList) {
              excludeConditions.push({ "description": { $not: { $regex: new RegExp(ele), $options: "m" } } });
              excludeConditions.push({ "title": { $not: { $regex: new RegExp(ele), $options: "m" } } });
            }

            orAdvCon.push({
              $and: [
                { $or: keywordConditions },
                { $and: excludeConditions }
              ]
            });
            break;

          case 2:
            // Only keywords exist
            let keywordOnlyConditions = [];
            for (let ele of keywordsList) {
              keywordOnlyConditions.push({ "description": { $regex: new RegExp(ele), $options: "m" } });
              keywordOnlyConditions.push({ "title": { $regex: new RegExp(ele), $options: "m" } });
            }

            orAdvCon.push({
              $and: [
                { $or: keywordOnlyConditions }
              ]
            });
            console.log(JSON.stringify(orAdvCon), "Keywords case");
            break;

          case 3:
            // Only exclude_words exist
            let excludeOnlyConditions = [];
            for (let ele of excludeWordsList) {
              excludeOnlyConditions.push({ "description": { $not: { $regex: new RegExp(ele), $options: "m" } } });
              excludeOnlyConditions.push({ "title": { $not: { $regex: new RegExp(ele), $options: "m" } } });
            }

            orAdvCon.push({
              $and: [
                { $and: excludeOnlyConditions }
              ]
            });
            console.log(JSON.stringify(orAdvCon), "Exclude words case");
            break;

          default:
            console.log("No keywords or exclude_words provided.");
        }

      } else if (search_type === searchType.ANY) {
        keywords = keywords.replace(/\s+/g, ",").split(",").join("|");
        search_type_filter = { $regex: new RegExp(keywords), $options: "i" };
      }


      for (let ele of keywordsList) {
        orCon.push({ "description": { $regex: new RegExp(ele.trim()), $options: "m" } })
        orCon.push({ "title": { $regex: new RegExp(ele.trim()), $options: "m" } })
      }

      if (extraFilter) filter = { ...filter, ...extraFilter };
      if ((keywords && keywords !== "") || (exclude_words && exclude_words !== ""))
        filter = {
          ...filter,
          $or: orAdvCon.length > 0 ? orAdvCon :
            orCon
          ,
        };

      if (country && country !== "") {

        filter.country = { $in: country.split(',').map(c => new RegExp(`^${c.trim()}$`, "i")) };
      }

      if (cpv_codes && cpv_codes !== "") {
        filter.cpv_codes = { $in: cpv_codes.split(",") };

      }
      if (sectors && sectors !== "") {

        filter.sectors = { $in: sectors.split(",") };
      }
      if (regions && regions !== "") {
        filter.regions = { $in: regions.split(",") };
        // filter = {
        //   ...filter,
        //   $or: [
        //     { regions: { $in: regions.split(",") } },
        //     { country: { $in: regions.split(",") } },
        //   ],
        // };
      }
      if (funding_agency && funding_agency !== "")
        filter.funding_agency = { $in: funding_agency.split(",") };
      if (location && location !== "")
        filter.address = { $regex: location, $options: "i" };
      if (from_date && to_date && from_date !== "" && to_date !== "") {
        filter.published_date = {
          $gte: new Date(new Date(from_date).setHours(0, 0, 0)),
        };
        const inputEndDate = new Date(to_date);
        function zeroPad(num) {
          return num < 10 ? '0' + num : num; // Pad single digits with a leading zero
        }
        const endDateStr = `${inputEndDate.getFullYear()}/${zeroPad(inputEndDate.getMonth() + 1)}/${zeroPad(inputEndDate.getDate())}`;

        filter.closing_date = {
          $lte: endDateStr,
        };
      }

      let superAdmin = await isSuperAdmin(req.session);
      if (req.session && superAdmin) select = tenders_all_field;

      let result = await readAllTenders(
        filter,
        select,
        { [sortField]: parseInt(sortBy) },
        parseInt(pageNo) * parseInt(limit),
        parseInt(limit)
      );

      responseSend(res, 201, "Tenders records", { ...result, ...req.query });
    }
  } catch (error) {
    console.log("4444444444444444444444", error)
    next(error);
  }
};
// export const tendersAllList = async (req, res, next) => {
//   try {
//     var {
//       keywords,
//       pageNo,
//       limit,
//       sortBy,
//       sortField,
//       cpv_codes,
//       sectors,
//       regions,
//       location,
//       funding_agency,
//       search_type,
//       extraFilter = null,
//       search_type_filter = null,
//       from_date = null,
//       to_date = null,
//       country = null,
//       exclude_words = null,
//     } = req.query;

//     let filter = { is_active: true, is_deleted: false };
//     let select = tenders_list;

//     if (search_type === searchType.EXACT) {
//       search_type_filter = keywords;
//     } else if (search_type === searchType.RELEVENT) {
//       search_type_filter = { $regex: keywords, $options: "m" };
//     } else if (search_type === searchType.ANY) {
//       keywords = keywords.replace(/\s+/g, ",").split(",").join("|");
//       search_type_filter = { $regex: keywords, $options: "i" };
//     }

//     if (exclude_words) {
//       search_type_filter = {
//         ...search_type_filter,
//         $not: { $regex: new RegExp(exclude_words), $options: "i" },
//       };
//     }

//     if (extraFilter) filter = { ...filter, ...extraFilter };

//     if (keywords && keywords !== "")
//       filter = {
//         ...filter,
//         $or: [
//           {
//             description: search_type_filter
//               ? search_type_filter
//               : { $regex: keywords, $options: "i" },
//           },
//         ],
//       };

//     if (country && country !== "")
//       filter.country = { $regex: new RegExp(`^${country}$`, "i") };
//     if (cpv_codes && cpv_codes !== "")
//       filter.cpv_codes = { $in: cpv_codes.split(",") };
//     if (sectors && sectors !== "") filter.sectors = { $in: sectors.split(",") };
//     if (regions && regions !== "") {
//       // filter.regions = { $in: regions.split(",") };
//       filter = {
//         ...filter,
//         $or: [
//           { regions: { $in: regions.split(",") } },
//           { country: { $in: regions.split(",") } },
//         ],
//       };
//     }
//     if (funding_agency && funding_agency !== "")
//       filter.funding_agency = { $in: funding_agency.split(",") };
//     if (location && location !== "")
//       filter.address = { $regex: location, $options: "i" };
//     if (from_date && to_date && from_date !== "" && to_date !== "") {
//       filter.published_date = {
//         $gte: new Date(new Date(from_date).setHours(0, 0, 0)),
//       };
//       filter.closing_date = {
//         $lte: new Date(new Date(to_date).setHours(23, 59, 59)),
//       };
//     }

//     let superAdmin = await isSuperAdmin(req.session);
//     if (req.session && superAdmin) select = tenders_all_field;

//     let result = await readAllTenders(
//       filter,
//       select,
//       { [sortField]: parseInt(sortBy) },
//       parseInt(pageNo) * parseInt(limit),
//       parseInt(limit)
//     );

//     responseSend(res, 201, "Tenders records", { ...result, ...req.query });
//   } catch (error) {
//     next(error);
//   }
// };


export const tendersGet = async (req, res, next) => {
  try {
    const { _id, ref_no } = req.query;

    let select = {};
    let filter = {};

    if (_id) filter = { _id };
    else filter = { big_ref_no: ref_no };

    if (req.session?.plans && req.session?.plans.plan_name !== "Free") {
      const notExpired = differenceInSeconds(
        new Date(req.session?.plans.plan_expire_date),
        new Date()
      );

      if (notExpired >= 0) {
        let customerData = await readCustomers(
          { customer_id: req.session.customer_id },
          { tenders_filter: 1 }
        );
        let accessFilter = {
          big_ref_no: ref_no,
        };

        let search_type_filter = null;
        if (customerData?.tenders_filter) {


          if (customerData.tenders_filter?.search_type) {
            if (customerData.tenders_filter?.search_type === searchType.EXACT) {
              search_type_filter = customerData.tenders_filter?.keywords;
            } else if (
              customerData.tenders_filter?.search_type === searchType.RELEVENT
            ) {
              search_type_filter = {
                $regex: customerData.tenders_filter?.keywords,
                $options: "m",
              };
            } else if (
              customerData.tenders_filter?.search_type === searchType.ANY
            ) {
              customerData.tenders_filter.keywords =
                customerData.tenders_filter?.keywords
                  .replace(/\s+/g, "")
                  .split(",")
                  .join("|");
              search_type_filter = {
                $regex: customerData.tenders_filter?.keywords,
                $options: "i",
              };
            }
          }

          if (
            customerData.tenders_filter?.keywords &&
            customerData.tenders_filter?.keywords !== ""
          )
            accessFilter = {
              ...accessFilter,
              $or: [
                {
                  description: search_type_filter
                    ? search_type_filter
                    : {
                      $regex: customerData.tenders_filter?.keywords,
                      $options: "i",
                    },
                },
              ],
            };
          if (
            customerData.tenders_filter?.sectors &&
            customerData.tenders_filter?.sectors.length > 0
          )
            accessFilter.sectors = { $in: customerData.tenders_filter?.sectors };
          if (
            customerData.tenders_filter.funding_agency &&
            customerData.tenders_filter.funding_agency.length > 0
          )
            accessFilter.funding_agency = {
              $in: customerData.tenders_filter.funding_agency,
            };
          if (
            customerData.tenders_filter.cpv_codes &&
            customerData.tenders_filter.cpv_codes.length > 0
          )
            accessFilter.cpv_codes = {
              $in: customerData.tenders_filter.cpv_codes,
            };
          if (
            customerData.tenders_filter.regions &&
            customerData.tenders_filter.regions.length > 0
          ) {
            accessFilter = {
              ...accessFilter,
              $or: [
                { regions: { $in: customerData.tenders_filter.regions } },
                { country: { $in: customerData.tenders_filter.regions } },
              ],
            };
          }
        }
        const tendersExists = await readTenders(accessFilter, { _id: 1 });
        if (tendersExists) {
          select = tenders_all_field;
        } else {
          select = tenders_limit_field;
        }
      } else {
        select = tenders_limit_field;
      }
    } else {
      select = tenders_limit_field;
    }

    let result = await readTenders(filter, select);

    responseSend(res, 201, "Tenders single record", result);
  } catch (error) {
    next(error);
  }
};

export const tendersAdd = async (req, res, next) => {
  try {
    const tender = req.body;

    // Step 1: Check if the tender already exists in the database
    const exists = await tendersModel.findOne({
      $or: [
        {
          tender_no: tender.tender_no,
          closing_date: tender.closing_date,
          country: tender.country,
        },
        {
          tender_no: { $ne: tender.tender_no },
          title: tender.title,
          published_date: tender.published_date,
          country: tender.country,
          closing_date: tender.closing_date,
        }
      ]
    });


    if (exists) {
      // If the tender exists, send a response indicating duplication
      return responseSend(res, 409, "Tender already exists.", []);
    }
    else {

      // Step 2: Generate big_ref_no based on existing tenders or fallback to count
      let baseRefNo = startingBigRefNo;
      const latestTender = await tendersModel.findOne().sort({ createdAt: -1 });

      if (latestTender) {
        baseRefNo = parseInt(latestTender.big_ref_no.split('-')[1]);
      } else {
        // const count = await tendersModel.count();
        // baseRefNo += count;
      }

      // Assign big_ref_no to the new tender
      tender.big_ref_no = "T-" + (baseRefNo + 1);

      // Step 3: Insert the new tender
      let result = await insertTenders(req.body);
      console.log("Inserted tender:", result);
      responseSend(res, 201, "Tender added successfully", result);
    }

  } catch (error) {
    next(error);
  }
};

export const tendersAddMultiple = async (req, res, next) => {
  try {
    const { tenders } = req.body;

    // Step 1: Deduplicate incoming tenders based on some unique criteria
    const uniqueTenders = tenders.reduce((acc, tender) => {
      if (!acc.some((t) =>
        t.tender_no === tender.tender_no &&
        t.closing_date === tender.closing_date &&
        t.country === tender.country &&
        t.title === tender.title
      )) {
        acc.push(tender);
      }
      return acc;
    }, []);

    // Step 2: Filter tenders to avoid inserting duplicates in the database
    const filteredTenders = [];
    for (const tender of uniqueTenders) {
      const exists = await tendersModel.findOne({
        $or: [
          {
            tender_no: tender.tender_no,
            closing_date: tender.closing_date,
            country: tender.country,
          },
          {
            tender_no: { $ne: tender.tender_no },
            title: tender.title,
            published_date: tender.published_date,
            country: tender.country,
            closing_date: tender.closing_date,
          }
        ]
      });


      if (!exists) {
        filteredTenders.push(tender);
      }
    }

    // Step 3: Generate big_ref_no based on existing tenders or fallback to count
    if (filteredTenders.length > 0) {
      let baseRefNo = startingBigRefNo;
      const latestTender = await tendersModel.findOne().sort({ createdAt: -1 });

      if (latestTender) {
        baseRefNo = parseInt(latestTender.big_ref_no.split('-')[1]);
      } else {
        // const count = await tendersModel.count();
        // baseRefNo += count;
      }

      await Promise.all(
        filteredTenders.map((tender, index) => {
          tender.big_ref_no = "T-" + (baseRefNo + index + 1);
          tender.createdAt = new Date(Date.now() + index);
        })
      );

      // Step 4: Insert new tenders
      const result = await tendersModel.insertMany(filteredTenders);
      console.log("Inserted tenders:", result);
      responseSend(res, 201, "Tenders data added successfully", result);
    } else {
      console.log("No new tenders to insert.");
      responseSend(res, 200, "No new tenders to insert.", []);
    }

  } catch (error) {
    next(error);
  }
};



export const tendersUpdate = async (req, res, next) => {
  try {
    const { _id } = req.body;

    let result = await updateTenders({ _id }, req.body);

    responseSend(res, 201, "Tenders updated successfully", result);
  } catch (error) {
    next(error);
  }
};

export const tendersDelete = async (req, res, next) => {
  try {
    const { _id } = req.query;

    await updateTenders({ _id }, { is_deleted: true, is_active: false });

    responseSend(res, 201, "Tenders deleted successfully", {});
  } catch (error) {
    next(error);
  }
};
