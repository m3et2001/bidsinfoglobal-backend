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

const contract_award_list_field = { big_ref_no: 1, project_location: 1, contractor_details: 1, description: 1, sectors: 1, awards_publish_date: 1, sectors: 1, cpv_codes: 1, funding_agency: 1, regions: 1, };
const contract_award_all_field = { contract_award_id: 1, org_name: 1, org_address: 1, telephone_no: 1, fax_number: 1, email: 1, contact_person: 1, big_ref_no: 1, document_no: 1, bidding_type: 1, project_location: 1, contractor_details: 1, tender_notice_no: 1, description: 1, cpv_codes: 1, funding_agency: 1, regions: 1, sectors: 1, awards_publish_date: 1, is_active: 1, createdAt: 1 };
const contract_award_limit_field = { big_ref_no: 1, project_location: 1, contractor_details: 1, description: 1, sectors: 1, cpv_codes: 1, funding_agency: 1, regions: 1, awards_publish_date: 1 };

export const contractAwardAllList = async (req, res, next) => {
    try {
        const { keywords, pageNo, limit, sortBy, sortField, cpv_codes, sectors, regions, location, country, funding_agency, extraFilter = null, search_type_filter = null } = req.query;
        let filter = { is_active: true, is_deleted: false };
        let select = contract_award_list_field;

        if (extraFilter)
            filter = { ...filter, ...extraFilter }

        if (keywords && keywords !== "")
            filter = {
                ...filter,
                $or: [
                    { description: search_type_filter ? search_type_filter : { $regex: keywords, $options: 'i' } },
                ]
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
    } catch (error) {
        next(error);
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
        const latestTender = await contractAwardModel.findOne().sort({ createdAt: -1 });
        console.log(latestTender)

        if (latestTender) {
            baseRefNo = parseInt(latestTender.big_ref_no.split('-')[1]);
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