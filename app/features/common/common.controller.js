"use strict";

import { formatISO, parseISO } from "date-fns";
import { searchType } from "../../helpers/constance.js";
import { responseSend } from "../../helpers/responseSend.js";
import { sendEMAIL } from "../../utils/email.util.js";
import { tendersAllList } from "../tenders/tenders.controller.js";
import { insertContactUs, insertDemoRequest, insertLogs, readContactUs, readDemoRequest } from "./common.service.js";
import { projectsAllList } from "../projects/projects.controller.js";
import { contractAwardAllList } from "../contract_award/contract_award.controller.js";
import { grantsAllList } from "../grants/grants.controller.js";
import { countGrants } from "../grants/grants.service.js";
import { countTenders } from "../tenders/tenders.service.js";
import { countProjects } from "../projects/projects.service.js";
import { countContracts } from "../contract_award/contract_award.service.js";
import { readCustomerForDashboard } from "../auth/auth.service.js";

export const handleDemoRequest = async (req, res, next) => {
    try {
        const insert = await insertDemoRequest(req.body);

        responseSend(res, 201, "Your request has been submitted successfully", insert);
    } catch (error) {
        next(error);
    }
};

export const listDemoRequest = async (req, res, next) => {
    try {
        const record = await readDemoRequest();

        responseSend(res, 201, "Success", record);
    } catch (error) {
        next(error);
    }
};

export const contactUsSubmit = async (req, res, next) => {
    try {
        const insert = await insertContactUs(req.body);

        await sendEMAIL(
            req.body.email,
            "Thank you for contacting us",
            "Thank you for contacting us you have entered following record",
            "<p>Thank you for contacting us you have entered following record</p>"
        );

        responseSend(res, 201, "Your request has been submitted successfully", insert);
    } catch (error) {
        next(error);
    }
};

export const listContactUs = async (req, res, next) => {
    try {
        const record = await readContactUs();

        responseSend(res, 201, "Success", record);
    } catch (error) {
        next(error);
    }
};

export const advanceSearch = async (req, res, next) => {
    try {
        const { notice_type, search_type, keywords, posting_date, closing_date,competition_type, pageNo, limit, sortBy, sortField, exclude_words } = req.body;

        const filter = {
            keywords,
            search_type,
            pageNo,
            limit,
            sortBy,
            sortField,
            competition_type,
            cpv_codes: req.body.cpv_codes || undefined,
            sectors: req.body.sectors || undefined,
            regions: req.body.regions || undefined,
            funding_agency: req.body.funding_agency || undefined,
            location: req.body.state || undefined,
            extraFilter: {}
        }

        if (search_type === searchType.EXACT)
            filter.search_type_filter = keywords;
        else if (search_type === searchType.RELEVENT)
            filter.search_type_filter = { $regex: keywords, $options: 'm' }
        else if (search_type === searchType.ANY)
            filter.search_type_filter = { $regex: keywords, $options: 'i' }

        if (exclude_words) {
            filter.exclude_words = exclude_words;
        }

        switch (notice_type) {
            case "Tender":
                if (req.body.tender_no)
                    filter.extraFilter.tender_no = req.body.tender_no || undefined;
                if (req.body.big_ref_no)
                    filter.extraFilter.big_ref_no = req.body.big_ref_no || undefined;
                if (req.body.tender_type)
                    filter.extraFilter.tender_type = req.body.tender_type || undefined;
                if (req.body.competition_type)
                    filter.extraFilter.tender_competition = req.body.competition_type || undefined;
                if (req.body.country)
                    filter.country = req.body.country || undefined;


                if (posting_date && posting_date.length > 1) {
                    filter.extraFilter.published_date = {
                        $gte: new Date(posting_date[0]),
                        $lte: new Date(posting_date[1])
                    }
                }
                if (closing_date && closing_date.length > 1) {
                    function zeroPad(num) {
                        return num < 10 ? '0' + num : num; // Pad single digits with a leading zero
                    }
                    const inputStartDate = new Date(closing_date[0]); // Example input start date
                    const inputEndDate = new Date(closing_date[1]);
                    const startDateStr = `${inputStartDate.getFullYear()}/${zeroPad(inputStartDate.getMonth() + 1)}/${zeroPad(inputStartDate.getDate())}`;
                    const endDateStr = `${inputEndDate.getFullYear()}/${zeroPad(inputEndDate.getMonth() + 1)}/${zeroPad(inputEndDate.getDate())}`;
                    filter.extraFilter.closing_date = {
                        $gte: startDateStr,
                        $lte: endDateStr
                    }
                }

                tendersAllList({ query: filter }, res, next);

                break;

            case "Project":
                if (posting_date && posting_date.length > 1) {
                    filter.extraFilter.project_publishing_date = {
                        $gte: new Date(posting_date[0]),
                        $lte: new Date(posting_date[1])
                    }
                }
                if (closing_date && closing_date.length > 1) {
                    filter.extraFilter.estimated_project_completion_date = {
                        $gte: new Date(closing_date[0]),
                        $lte: new Date(closing_date[1])
                    }
                }

                projectsAllList({ query: filter }, res, next);

                break;

            case "Contract Award":

                if (req.body.big_ref_no)
                    filter.big_ref_no = { $regex: req.body.big_ref_no, $options: 'i' };
                if (req.body.contract_value)
                    filter.contractor_details = { $regex: req.body.contract_value, $options: 'i' };

                if (posting_date && posting_date.length > 1) {
                    filter.extraFilter.awards_publish_date = {
                        $gte: new Date(posting_date[0]),
                        $lte: new Date(posting_date[1])
                    }
                }

                contractAwardAllList({ query: filter }, res, next);

                break;

            case "Grants":
                filter.big_ref_no = req.body.big_ref_no || "";

                if (posting_date && posting_date.length > 1) {
                    filter.extraFilter.post_date = {
                        $gte: new Date(posting_date[0]),
                        $lte: new Date(posting_date[1])
                    }
                }

                grantsAllList({ query: filter }, res, next);

                break;

            default:
                break;
        }

    } catch (error) {
        next(error);
    }
};

export const dashboardData = async (req, res, next) => {
    try {
        const grants = await countGrants({ is_active: true, is_deleted: false });
        const tenders = await countTenders({ is_active: true, is_deleted: false });
        const projects = await countProjects({ is_active: true, is_deleted: false });
        const contracts = await countContracts({ is_active: true, is_deleted: false });

        const customerData = await readCustomerForDashboard();

        let response = {
            grants: grants[0]?.grants,
            tenders: tenders[0]?.tenders,
            projects: projects[0]?.projects,
            contracts: contracts[0]?.contracts,
            customerData: customerData[0]?.data
        }

        responseSend(res, 201, "Success", response);
    } catch (error) {
        next(error);
    }
};

export const generateLogs = async (payload) => {
    try {
        await insertLogs(payload);
        return true;
    } catch (error) {
        next(error);
    }
};