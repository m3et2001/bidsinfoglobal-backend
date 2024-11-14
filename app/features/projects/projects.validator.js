import BaseJoi from "joi";
import JoiDate from "@joi/date";
const Joi = BaseJoi.extend(JoiDate);

export const projectsAllListVal = Joi.object({
    pageNo: Joi.string().allow(""),
    limit: Joi.string().allow(""),
    sortBy: Joi.string().allow(""),
    sortField: Joi.string().allow(""),
    keywords: Joi.string().allow(""),
    cpv_codes: Joi.string().allow(""),
    sectors: Joi.string().allow(""),
    regions: Joi.string().allow(""),
    country: Joi.string().allow(""),
    location: Joi.string().allow(""),
    notice_type: Joi.string().allow(""),
    funding_agency: Joi.string().allow(""),
});

export const projectsGetVal = Joi.object({
    _id: Joi.string().allow(""),
    project_id: Joi.string().allow(""),
});

export const projectsAddVal = Joi.object({
    project_name: Joi.string().required(),
    title: Joi.string().allow(""),
    project_id: Joi.string().allow(""),
    big_ref_no: Joi.string().allow(""),
    project_background: Joi.string().allow(""),
    project_location: Joi.string().allow(""),
    project_status: Joi.string().allow(""),
    project_publishing_date: Joi.string().allow(""),
    estimated_project_completion_date: Joi.string().allow(""),
    client_name: Joi.string().allow(""),
    client_address: Joi.string().allow(""),
    funding_agency_name: Joi.string().allow(""),
    sectors: Joi.string().allow(""),
    regions: Joi.string().allow(""),
    cpv_codes: Joi.string().allow(""),
    is_active: Joi.boolean().allow(""),
    funding_agency: Joi.string().allow(""),
});

export const projectsUpdateVal = Joi.object({
    _id: Joi.string().required(),
    project_name: Joi.string().required(),
    title: Joi.string().allow(""),
    project_id: Joi.string().allow(""),
    project_background: Joi.string().allow(""),
    big_ref_no: Joi.string().allow(""),
    project_location: Joi.string().allow(""),
    project_status: Joi.string().allow(""),
    project_publishing_date: Joi.string().allow(""),
    estimated_project_completion_date: Joi.string().allow(""),
    client_name: Joi.string().allow(""),
    client_address: Joi.string().allow(""),
    funding_agency_name: Joi.string().allow(""),
    sectors: Joi.string().allow(""),
    regions: Joi.string().allow(""),
    cpv_codes: Joi.string().allow(""),
    is_active: Joi.boolean().allow(""),
    funding_agency: Joi.string().allow(""),
});

export const projectsDeleteVal = Joi.object({
    _id: Joi.string().required()
});

export const projectsAddMultipleVal = Joi.object({
    projects: Joi.array().items(
        Joi.object({
            project_name: Joi.string().required(),
            title: Joi.string().allow(""),
            project_id: Joi.string().allow(""),
            project_background: Joi.string().allow(""),
            project_location: Joi.string().allow(""),
            project_status: Joi.string().allow(""),
            project_publishing_date: Joi.string().allow(""),
            estimated_project_completion_date: Joi.string().allow(""),
            client_name: Joi.string().allow(""),
            client_address: Joi.string().allow(""),
            funding_agency_name: Joi.string().allow(""),
            sectors: Joi.string().allow(""),
            regions: Joi.string().allow(""),
            cpv_codes: Joi.string().allow(""),
            is_active: Joi.boolean().allow(""),
            funding_agency: Joi.string().allow("")
        })
    ).required("Projects required")
});