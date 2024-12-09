"use strict";

import { differenceInSeconds } from "date-fns";
import { isSuperAdmin } from "../../helpers/common.js";
import { responseSend } from "../../helpers/responseSend.js";
import {
    insertGrants, readAllGrants, readGrants, updateGrants,
} from "./grants.service.js";
import { generateLogs } from "../common/common.controller.js";
import grantsModel from "../../models/grants.model.js";
import { searchType, startingBigRefNo } from "../../helpers/constance.js";
import { readCustomers } from "../auth/auth.service.js";
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
const grants_list_field = { location: 1, big_ref_no: 1, title: 1, sectors: 1, regions: 1, cpv_codes: 1, funding_agency: 1, funding_agency: 1, deadline: 1, post_date: 1, createAt: 1 };
const grants_all_field = { grants_id: 1, donor: 1, contact_information: 1, location: 1, big_ref_no: 1, title: 1, type: 1, status: 1, value: 1, type_of_services: 1, sectors: 1, regions: 1, cpv_codes: 1, funding_agency: 1, funding_agency: 1, deadline: 1, duration: 1, attachment: 1, post_date: 1, createAt: 1 };
const grants_limit_field = { grants_id: 1, title: 1, location: 1, big_ref_no: 1, sectors: 1, regions: 1, cpv_codes: 1, funding_agency: 1, funding_agency: 1, deadline: 1, post_date: 1, createAt: 1 };

export const grantsAllList = async (req, res, next) => {
    // try {
        var { keywords, pageNo, limit, sortBy, sortField, cpv_codes, sectors, regions, location, country, funding_agency, extraFilter = null, search_type_filter = null, raw_query,
            query_type, search_type, exclude_words = null, } = req.query;

        if (query_type === "raw_query") {
            const pipeline = convertToQueryObject(raw_query)
            const result = await grantsModel.aggregate(pipeline, { allowDiskUse: true })
            // Counting total results
            let sliceCount = 1

            const countPipeline = [
                ...pipeline.slice(0, sliceCount),
                { $count: "count" }
            ];
            const countResult = await grantsModel.aggregate(countPipeline, { allowDiskUse: true })
            const count = countResult[0]?.count || 0;
            const query = pipeline

            const re = { result, count, query }
            responseSend(res, 201, "Grants records", { ...re, ...req.query });

        }
        else {
            let filter = { is_active: true, is_deleted: false };
            let select = grants_list_field;
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
                          { "title": { $regex: new RegExp(keywords.trim()), $options: "m" } }
                        ]
                      },
                      {
                        $and: [
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
                    keywordConditions.push({ "title": { $regex: new RegExp(ele), $options: "m" } });
                  }
      
                  let excludeConditions = [];
                  for (let ele of excludeWordsList) {
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
              orCon.push({ "title": { $regex: new RegExp(ele.trim()), $options: "m" } })
            }

            if (extraFilter)
                filter = { ...filter, ...extraFilter }

            // if (keywords && keywords !== "")
            //     filter = {
            //         ...filter,
            //         $or: [
            //             { title: search_type_filter ? search_type_filter : { $regex: keywords, $options: 'i' } },
            //         ]
            //     };
            if ((keywords && keywords !== "") || (exclude_words && exclude_words !== ""))
                filter = {
                  ...filter,
                  $or: orAdvCon.length > 0 ? orAdvCon :
                    orCon
                  ,
                };

            if (cpv_codes && cpv_codes !== "")
                filter.cpv_codes = { $in: cpv_codes.split(",") }
            if (sectors && sectors !== "")
                filter.sectors = { $in: sectors.split(",") };
            if (regions && regions !== "") {
                // filter.regions = { $in: regions.split(",") };
                filter = {
                    ...filter,
                    $or: [
                        { "regions": { $in: regions.split(",") } },
                        { "location": { $in: regions.split(",") } }
                    ]
                };
            }
            if (funding_agency && funding_agency !== "")
                filter.funding_agency = { $in: funding_agency.split(",") };
            if (location && location !== "")
                filter.location = { $regex: location, $options: 'i' }
            if (country && country !== "")
                filter.location = { $regex: country, $options: 'i' }


            if (req.session && isSuperAdmin(req.session))
                select = grants_all_field;

            let result = await readAllGrants(
                filter,
                select,
                { [sortField]: parseInt(sortBy) },
                parseInt(pageNo) * parseInt(limit),
                parseInt(limit),
            )

            responseSend(res, 201, "Grants records", { ...result, ...req.query });
        }
    // } catch (error) {
    //     next(error);
    // }
};

export const grantsGet = async (req, res, next) => {
    try {
        const { _id, ref_no } = req.query;

        if (!_id && !ref_no) {
            throw new Error("Id or ref no is required");
        }

        let select = {};
        let filter = {};

        if (req.session?.plans && req.session?.plans.plan_name !== "Free") {
            const notExpired = differenceInSeconds(
                new Date(req.session?.plans.plan_expire_date),
                new Date()
            );

            if (notExpired >= 0) {
                let customerData = await readCustomers({ customer_id: req.session.customer_id }, { tenders_filter: 1 });
                let accessFilter = {
                    big_ref_no: ref_no
                };

                let search_type_filter = null;
                if (customerData.tenders_filter.search_type) {
                    if (customerData.tenders_filter.search_type === searchType.EXACT) {
                        search_type_filter = customerData.tenders_filter.keywords;
                    } else if (customerData.tenders_filter.search_type === searchType.RELEVENT) {
                        search_type_filter = { $regex: customerData.tenders_filter.keywords, $options: 'm' }
                    } else if (customerData.tenders_filter.search_type === searchType.ANY) {
                        customerData.tenders_filter.keywords = customerData.tenders_filter.keywords.replace(/\s+/g, '').split(",").join("|");
                        search_type_filter = { $regex: customerData.tenders_filter.keywords, $options: 'i' }
                    }
                }

                if (customerData.tenders_filter.keywords && customerData.tenders_filter.keywords !== "")
                    accessFilter = {
                        ...accessFilter,
                        $or: [
                            { "project_background": search_type_filter ? search_type_filter : { $regex: customerData.tenders_filter.keywords, $options: 'i' } }
                        ]
                    };
                if (customerData.tenders_filter.sectors && customerData.tenders_filter.sectors.length > 0)
                    accessFilter.sectors = { $in: customerData.tenders_filter.sectors };
                if (customerData.tenders_filter.funding_agency && customerData.tenders_filter.funding_agency.length > 0)
                    accessFilter.funding_agency = { $in: customerData.tenders_filter.funding_agency };
                if (customerData.tenders_filter.cpv_codes && customerData.tenders_filter.cpv_codes.length > 0)
                    accessFilter.cpv_codes = { $in: customerData.tenders_filter.cpv_codes };
                if (customerData.tenders_filter.regions && customerData.tenders_filter.regions.length > 0) {
                    accessFilter = {
                        ...accessFilter,
                        $or: [
                            { "regions": { $in: customerData.tenders_filter.regions } },
                            { "country": { $in: customerData.tenders_filter.regions } }
                        ]
                    };
                }
                const fullAccessAllowed = await readGrants(accessFilter, { _id: 1 });
                if (fullAccessAllowed) {
                    select = grants_all_field;
                } else {
                    select = grants_limit_field;
                }
            } else {
                select = grants_limit_field;
            }
        } else {
            select = grants_limit_field;
        }

        if (_id)
            filter = { _id }
        else
            filter = { big_ref_no: ref_no }

        let result = await readGrants(filter, select);

        responseSend(res, 201, "Grants single record", result);
    } catch (error) {
        next(error);
    }
}

export const grantsAdd = async (req, res, next) => {
    try {
        let result = await insertGrants(req.body);

        // add logs here
        // generateLogs()

        responseSend(res, 201, "Grants added successfully", result);
    } catch (error) {
        next(error);
    }
}

export const grantsAddMultiple = async (req, res, next) => {
    try {
        const { grants } = req.body;

        const count = await grantsModel.count();

        await Promise.all(projects.map((e, k) => e.big_ref_no = "G-" + (startingBigRefNo + count + (k + 1))));

        let result = await grantsModel.insertMany(grants);

        responseSend(res, 201, "Grants award getting upload", result);
    } catch (error) {
        next(error);
    }
}

export const grantsUpdate = async (req, res, next) => {
    try {
        const { _id } = req.body;
        let result = await updateGrants({ _id }, req.body);

        responseSend(res, 201, "Grants updated successfully", result);
    } catch (error) {
        next(error);
    }
}

export const grantsDelete = async (req, res, next) => {
    try {
        const { _id } = req.query;

        await updateGrants({ _id }, { is_deleted: true, is_active: false });

        responseSend(res, 201, "Grants deleted successfully", {});
    } catch (error) {
        next(error);
    }
}