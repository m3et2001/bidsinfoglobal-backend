"use strict";

import { differenceInSeconds, formatISO } from "date-fns";
import { isSuperAdmin } from "../../helpers/common.js";
import { responseSend } from "../../helpers/responseSend.js";
import {
    insertTenders, readAllTenders, readTenders, updateTenders,
} from "./tenders.service.js";
import { readCustomers } from "../auth/auth.service.js";
import tendersModel from "../../models/tenders.model.js";
import { searchType } from "../../helpers/constance.js";
import { startingBigRefNo } from "../../helpers/constance.js";

const tenders_list = { sectors: 1, country: 1, big_ref_no: 1, description: 1, published_date: 1, closing_date: 1, cpv_codes: 1, createdAt: 1 };

export const tenders_all_field = { authority_name: 1, sectors: 1, cpv_codes: 1, regions: 1, address: 1, telephone: 1, fax_number: 1, email: 1, contact_person: 1, big_ref_no: 1, description: 1, tender_type: 1, tender_no: 1, funding_agency: 1, tender_competition: 1, published_date: 1, closing_date: 1, country: 1, emd: 1, estimated_cost: 1, documents: 1, is_active: 1, is_active: 1, createdAt: 1 };

const tenders_limit_field = { description: 1, published_date: 1, closing_date: 1, country: 1, emd: 1, estimated_cost: 1, documents: 1, sectors: 1, cpv_codes: 1, regions: 1, createdAt: 1 }


export const tendersAllList = async (req, res, next) => {
    try {
        var { keywords, pageNo, limit, sortBy, sortField, cpv_codes, sectors, regions, location, funding_agency, search_type, extraFilter = null, search_type_filter = null, from_date = null, to_date = null, country = null, exclude_words = null } = req.query;

        let filter = { is_active: true, is_deleted: false };
        let select = tenders_list;

        if (search_type === searchType.EXACT) {
            search_type_filter = keywords;
        } else if (search_type === searchType.RELEVENT) {
            search_type_filter = { $regex: keywords, $options: 'm' }
        } else if (search_type === searchType.ANY) {
            keywords = keywords.replace(/\s+/g, ',').split(",").join("|");
            search_type_filter = { $regex: keywords, $options: 'i' }
        }

        if (exclude_words) {
            search_type_filter = {
                ...search_type_filter,
                $not: { $regex: new RegExp(exclude_words), $options: 'i' }
            }
        }

        if (extraFilter)
            filter = { ...filter, ...extraFilter }

        if (keywords && keywords !== "")
            filter = {
                ...filter,
                $or: [
                    { "description": search_type_filter ? search_type_filter : { $regex: keywords, $options: 'i' } }
                ]
            };

        if (country && country !== "")
            filter.country = country;
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
                    { "country": { $in: regions.split(",") } }
                ]
            };
        }
        if (funding_agency && funding_agency !== "")
            filter.funding_agency = { $in: funding_agency.split(",") };
        if (location && location !== "")
            filter.address = { $regex: location, $options: 'i' }
        if (from_date && to_date && from_date !== "" && to_date !== "") {
            filter.published_date = {
                $gte: new Date(new Date(from_date).setHours(0, 0, 0)),
            }
            filter.closing_date = {
                $lte: new Date(new Date(to_date).setHours(23, 59, 59))
            }
        }

        let superAdmin = await isSuperAdmin(req.session);
        if (req.session && superAdmin)
            select = tenders_all_field;

        let result = await readAllTenders(
            filter,
            select,
            { [sortField]: parseInt(sortBy) },
            parseInt(pageNo) * parseInt(limit),
            parseInt(limit),
        )

        responseSend(res, 201, "Tenders records", { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
};

export const tendersGet = async (req, res, next) => {
    try {
        const { _id, ref_no } = req.query;

        let select = {};
        let filter = {};

        if (_id)
            filter = { _id }
        else
            filter = { big_ref_no: ref_no }

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
                            { "description": search_type_filter ? search_type_filter : { $regex: customerData.tenders_filter.keywords, $options: 'i' } }
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
}

export const tendersAdd = async (req, res, next) => {
    try {
        let result = await insertTenders(req.body);

        responseSend(res, 201, "Tenders added successfully", result);
    } catch (error) {
        next(error);
    }
}

export const tendersAddMultiple = async (req, res, next) => {
    try {
        const { tenders } = req.body;

        const count = await tendersModel.count();

        await Promise.all(tenders.map((e, k) => e.big_ref_no = "T-" + (startingBigRefNo + count + (k + 1))));

        let result = await tendersModel.insertMany(tenders);

        responseSend(res, 201, "Tenders data added successfully", result);
    } catch (error) {
        next(error);
    }
}

export const tendersUpdate = async (req, res, next) => {
    try {
        const { _id } = req.body;

        let result = await updateTenders({ _id }, req.body);

        responseSend(res, 201, "Tenders updated successfully", result);
    } catch (error) {
        next(error);
    }
}

export const tendersDelete = async (req, res, next) => {
    try {
        const { _id } = req.query;

        await updateTenders({ _id }, { is_deleted: true, is_active: false });

        responseSend(res, 201, "Tenders deleted successfully", {});
    } catch (error) {
        next(error);
    }
}