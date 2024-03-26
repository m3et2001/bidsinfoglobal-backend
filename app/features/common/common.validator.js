import BaseJoi from "joi";
import JoiDate from "@joi/date";
const Joi = BaseJoi.extend(JoiDate);

export const validateDemoRequest = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phoneno: Joi.string().required(),
    organization: Joi.string().required(),
    website: Joi.string().allow(""),
    country: Joi.string().allow(""),
});

export const validateContactUs = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    subject: Joi.string().required(),
    message: Joi.string().required(),
});

export const validateAdvanceSearch = Joi.object({
    search_type: Joi.string().required(),
    keywords: Joi.string().allow(""),
    pageNo: Joi.any().allow(""),
    limit: Joi.any().allow(""),
    sortBy: Joi.any().allow(""),
    sortField: Joi.any().allow(""),
    exclude_words: Joi.string().allow(""),
    cpv_codes: Joi.string().allow(""),
    sectors: Joi.string().allow(""),
    regions: Joi.string().allow(""),
    country: Joi.string().allow(""),
    state: Joi.string().allow(""),
    location_type: Joi.string().allow(""),
    funding_agency: Joi.string().allow(""),
    contract_value: Joi.string().allow(""),
    tender_no: Joi.string().allow(""),
    big_ref_no: Joi.string().allow(""),
    competition_type: Joi.string().allow(""),
    notice_type: Joi.string().required(),
    tender_type: Joi.string().allow(""),
    posting_date: Joi.array().allow(""),
    closing_date: Joi.array().allow("")
});