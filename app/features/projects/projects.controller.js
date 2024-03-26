"use strict";

import { differenceInSeconds } from "date-fns";
import { isSuperAdmin } from "../../helpers/common.js";
import { searchType, startingBigRefNo } from "../../helpers/constance.js";
import { responseSend } from "../../helpers/responseSend.js";
import projectsModel from "../../models/projects.model.js";
import {
    insertProjects, readAllProjects, readProjects, updateProjects,
} from "./projects.service.js";
import { readCustomers } from "../auth/auth.service.js";

const project_list_field = { project_id: 1, project_background: 1, project_location: 1, project_publishing_date: 1, estimated_project_completion_date: 1, sectors: 1, cpv_codes: 1, regions: 1 };
const project_all_field = { project_id: 1, project_name: 1, project_background: 1, project_location: 1, project_status: 1, project_publishing_date: 1, estimated_project_completion_date: 1, client_name: 1, client_address: 1, funding_agency: 1, sectors: 1, regions: 1, cpv_codes: 1, is_active: 1, createdAt: 1 };
const project_limit_field = { project_id: 1, project_name: 1, project_background: 1, project_location: 1, project_status: 1, project_publishing_date: 1, estimated_project_completion_date: 1, sectors: 1, cpv_codes: 1, regions: 1, is_active: 1, createdAt: 1 };

export const projectsAllList = async (req, res, next) => {
    try {
        const { keywords, pageNo, limit, sortBy, sortField, cpv_codes, sectors, regions, location, funding_agency, extraFilter = null, search_type_filter = null, country = null } = req.query;
        let filter = { is_active: true, is_deleted: false };
        let select = project_list_field;

        if (extraFilter)
            filter = { ...filter, ...extraFilter }

        if (keywords && keywords !== "")
            filter = {
                ...filter,
                $or: [
                    { project_background: search_type_filter ? search_type_filter : { $regex: keywords, $options: 'i' } },
                ]
            };

        if (cpv_codes && cpv_codes !== "")
            filter.cpv_codes = { $in: cpv_codes.split(",") }
        if (sectors && sectors !== "")
            filter.sectors = { $in: sectors.split(",") };
        if (regions && regions !== "") {
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
            select = project_all_field;

        let result = await readAllProjects(
            filter,
            select,
            { [sortField]: parseInt(sortBy) },
            parseInt(pageNo) * parseInt(limit),
            parseInt(limit),
        )

        responseSend(res, 201, "Projects records", { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
};

export const projectsGet = async (req, res, next) => {
    try {
        const { _id, project_id } = req.query;

        if (!_id && !project_id) {
            throw new Error("Id or project_id is required");
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
                    project_id: project_id
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
                const fullAccessAllowed = await readProjects(accessFilter, { _id: 1 });
                if (fullAccessAllowed) {
                    select = project_all_field;
                } else {
                    select = project_limit_field;
                }
            } else {
                select = project_limit_field;
            }

        } else {
            select = project_limit_field;
        }

        if (_id)
            filter = { _id }
        else
            filter = { project_id: project_id }

        let result = await readProjects(filter, select);

        responseSend(res, 201, "Projects single record", result);
    } catch (error) {
        next(error);
    }
}

export const projectsAdd = async (req, res, next) => {
    try {
        let result = await insertProjects(req.body);

        responseSend(res, 201, "Projects added successfully", result);
    } catch (error) {
        next(error);
    }
}

export const projectsAddMultiple = async (req, res, next) => {
    try {
        const { projects } = req.body;

        const count = await projectsModel.count();

        await Promise.all(projects.map((e, k) => e.big_ref_no = "P-" + (startingBigRefNo + count + (k + 1))));

        let result = await projectsModel.insertMany(projects);

        responseSend(res, 201, "Projects data added successfully", result);

    } catch (error) {
        next(error);
    }
}

export const projectsUpdate = async (req, res, next) => {
    try {
        const { _id } = req.body;

        let result = await updateProjects({ _id }, req.body);

        responseSend(res, 201, "Projects updated successfully", result);
    } catch (error) {
        next(error);
    }
}

export const projectsDelete = async (req, res, next) => {
    try {
        const { _id } = req.query;

        await updateProjects({ _id }, { is_deleted: true, is_active: false });

        responseSend(res, 201, "Projects deleted successfully", {});
    } catch (error) {
        next(error);
    }
}