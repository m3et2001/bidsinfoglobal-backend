"use strict";

import { differenceInSeconds } from "date-fns";
import { isSuperAdmin } from "../../helpers/common.js";
import { searchType, startingBigRefNo } from "../../helpers/constance.js";
import { responseSend } from "../../helpers/responseSend.js";
import contractAwardModel from "../../models/contract_award.model.js";
import {
    insertContractAward, readAllContractAward, readContractAward, updateContractAward,
} from "./contract_award.service.js";
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
const contract_award_list_field = { title: 1, big_ref_no: 1, project_location: 1, contractor_details: 1, description: 1, sectors: 1, awards_publish_date: 1, sectors: 1, cpv_codes: 1, funding_agency: 1, regions: 1, };
const contract_award_all_field = { title: 1, contract_award_id: 1, org_name: 1, org_address: 1, telephone_no: 1, fax_number: 1, email: 1, contact_person: 1, big_ref_no: 1, document_no: 1, bidding_type: 1, project_location: 1, contractor_details: 1, tender_notice_no: 1, description: 1, cpv_codes: 1, funding_agency: 1, regions: 1, sectors: 1, awards_publish_date: 1, is_active: 1, createdAt: 1 };
const contract_award_limit_field = { title: 1, big_ref_no: 1, project_location: 1, contractor_details: 1, description: 1, sectors: 1, cpv_codes: 1, funding_agency: 1, regions: 1, awards_publish_date: 1 };

export const contractAwardAllList = async (req, res, next) => {
    try {
        const { keywords, pageNo, search_type, limit, sortBy, sortField, cpv_codes, sectors, regions, location, country, funding_agency, extraFilter = null, search_type_filter = null, query_type, raw_query, exclude_words = null } = req.query;

        if (query_type === "raw_query") {
            const pipeline = convertToQueryObject(raw_query)
            const result = await contractAwardModel.aggregate(pipeline, { allowDiskUse: true })
            // Counting total results
            let sliceCount = 1

            const countPipeline = [
                ...pipeline.slice(0, sliceCount),
                { $count: "count" }
            ];
            const countResult = await contractAwardModel.aggregate(countPipeline, { allowDiskUse: true })
            const count = countResult[0]?.count || 0;
            const query = pipeline

            const re = { result, count, query }
            responseSend(res, 201, "Contract award records", { ...re, ...req.query });

        }
        else {
            let filter = { is_active: true, is_deleted: false };
            let select = contract_award_list_field;
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
            //             { description: search_type_filter ? search_type_filter : { $regex: keywords, $options: 'i' } },
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
                        { "project_location": { $in: regions.split(",") } }
                    ]
                };
            }
            if (funding_agency && funding_agency !== "")
                filter.funding_agency = { $in: funding_agency.split(",") };
            if (country && country !== "")
                filter.project_location = { $regex: country, $options: 'i' }
            if (location && location !== "")
                filter.project_location = { $regex: location, $options: 'i' }

            if (req.session && isSuperAdmin(req.session))
                select = contract_award_all_field;

            let result = await readAllContractAward(
                filter,
                select,
                { [sortField]: parseInt(sortBy) },
                parseInt(pageNo) * parseInt(limit),
                parseInt(limit),
            )

            responseSend(res, 201, "Contract award records", { ...result, ...req.query });
        }
    } catch (error) {
        next(error);
    }
};
export const contractAwardAllListForCron = async (query) => {
    try {
        const { keywords, pageNo, search_type, limit, sortBy, sortField, cpv_codes, sectors, regions, location, country, funding_agency, extraFilter = null, search_type_filter = null, query_type, raw_query, exclude_words = null } = query;

        if (query_type === "raw_query") {
            const pipeline = convertToQueryObject(raw_query)
            const result = await contractAwardModel.aggregate(pipeline, { allowDiskUse: true })
            // Counting total results
            let sliceCount = 1

            const countPipeline = [
                ...pipeline.slice(0, sliceCount),
                { $count: "count" }
            ];
            const countResult = await contractAwardModel.aggregate(countPipeline, { allowDiskUse: true })
            const count = countResult[0]?.count || 0;
            const query = pipeline

            const re = { result, count, query }
            return result


        }
        else {
            let filter = { is_active: true, is_deleted: false };
            let select = contract_award_all_field;
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
            //             { description: search_type_filter ? search_type_filter : { $regex: keywords, $options: 'i' } },
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
                filter.cpv_codes = { $in: cpv_codes }
            if (sectors && sectors !== "")
                filter.sectors = { $in: sectors };
            if (regions && regions !== "") {
                // filter.regions = { $in: regions.split(",") };
                filter = {
                    ...filter,
                    $or: [
                        { "regions": { $in: regions } },
                        { "project_location": { $in: regions } }
                    ]
                };
            }
            if (funding_agency && funding_agency !== "")
                filter.funding_agency = { $in: funding_agency };
            if (country && country !== "")
                filter.project_location = { $in: country.map(c => new RegExp(`^${c.trim()}$`, "i")) };
            if (location && location !== "")
                filter.project_location = { $in: location.map(c => new RegExp(`^${c.trim()}$`, "i")) };

           

            let result = await readAllContractAward(
                filter,
                select,
                { ["createdAt"]: 1 },
                0,
                1000
            )
            return result


        }
    } catch (error) {
        console.log(error)
        return []
        // next(error);
    }
};

export const contractAwardGet = async (req, res, next) => {
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
                const fullAccessAllowed = await readContractAward(accessFilter, { _id: 1 });
                if (fullAccessAllowed) {
                    select = contract_award_all_field;
                } else {
                    select = contract_award_limit_field;
                }
            } else {
                select = contract_award_limit_field;
            }

        } else {
            select = contract_award_limit_field;
        }

        if (_id)
            filter = { _id }
        else
            filter = { big_ref_no: ref_no }

        let result = await readContractAward(filter, select);

        responseSend(res, 201, "Contract award single record", result);
    } catch (error) {
        next(error);
    }
}

export const contractAwardAdd = async (req, res, next) => {
    try {
        // Step 1: Generate big_ref_no based on existing tenders or fallback to count
        let baseRefNo = startingBigRefNo;
        const latestContract = await contractAwardModel.findOne().sort({ createdAt: -1 });

        if (latestContract) {
            baseRefNo = parseInt(latestContract.big_ref_no.split('-')[1]);
        } else {
            // const count = await contractAwardModel.count();
            // baseRefNo += count;
        }

        // Assign big_ref_no to the new tender
        req.body.big_ref_no = "CA-" + (baseRefNo + 1);
        let result = await insertContractAward(req.body);

        responseSend(res, 201, "Contract award added successfully", result);
    } catch (error) {
        next(error);
    }
}

export const contractAwardAddMultiple = async (req, res, next) => {
    try {
        const { contracts } = req.body;

        // Step 1: Retrieve the latest contract award's big_ref_no
        let baseRefNo = startingBigRefNo;
        const latestContract = await contractAwardModel.findOne().sort({ createdAt: -1 });

        if (latestContract) {
            // Extract the numeric part of big_ref_no from the latest contract and increment
            baseRefNo = parseInt(latestContract.big_ref_no.split('-')[1]) + 1;
        }

        // Step 2: Assign big_ref_no to each contract and increment from the baseRefNo
        contracts.forEach((contract, index) => {
            contract.big_ref_no = "CA-" + (baseRefNo + index);
            contract.createdAt = new Date(Date.now() + index);

        });


        let result = await contractAwardModel.insertMany(contracts);

        responseSend(res, 201, "Contract award added successfully", result);
    } catch (error) {
        next(error);
    }
}

export const contractAwardUpdate = async (req, res, next) => {
    try {
        const { _id } = req.body;

        let result = await updateContractAward({ _id }, req.body);

        responseSend(res, 201, "Contract award updated successfully", result);
    } catch (error) {
        next(error);
    }
}

export const contractAwardDelete = async (req, res, next) => {
    try {
        const { _id } = req.query;

        await updateContractAward({ _id }, { is_deleted: true, is_active: false });

        responseSend(res, 201, "Contract award deleted successfully", {});
    } catch (error) {
        next(error);
    }
}