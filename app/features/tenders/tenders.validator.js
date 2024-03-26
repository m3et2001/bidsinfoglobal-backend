import BaseJoi from "joi";
import JoiDate from "@joi/date";
const Joi = BaseJoi.extend(JoiDate);

export const tendersAllListVal = Joi.object({
    pageNo: Joi.string().allow(""),
    limit: Joi.string().allow(""),
    sortBy: Joi.string().allow(""),
    sortField: Joi.string().allow(""),
    keywords: Joi.string().allow(""),
    cpv_codes: Joi.string().allow(""),
    sectors: Joi.string().allow(""),
    regions: Joi.string().allow(""),
    location: Joi.string().allow(""),
    notice_type: Joi.string().allow(""),
    funding_agency: Joi.string().allow(""),
    from_date: Joi.string().allow(""),
    to_date: Joi.string().allow(""),
    search_type: Joi.string().allow(""),
    country: Joi.string().allow(""),
});

export const tendersGetVal = Joi.object({
    _id: Joi.string().allow(""),
    ref_no: Joi.string().allow(""),
});

export const tendersAddVal = Joi.object({
    authority_name: Joi.string().required(),
    sectors: Joi.string().required(),
    regions: Joi.string().required(),
    cpv_codes: Joi.string().required(),
    address: Joi.string().allow(""),
    telephone: Joi.string().allow(""),
    fax_number: Joi.string().allow(""),
    email: Joi.string().allow(""),
    contact_person: Joi.string().allow(""),
    big_ref_no: Joi.string().required(),
    description: Joi.string().allow(""),
    tender_type: Joi.string().allow(""),
    tender_no: Joi.string().allow(""),
    funding_agency: Joi.string().allow(""),
    tender_competition: Joi.string().allow(""),
    published_date: Joi.string().allow(""),
    closing_date: Joi.string().allow(""),
    country: Joi.string().allow(""),
    emd: Joi.string().allow(""),
    estimated_cost: Joi.string().allow(""),
    documents: Joi.string().allow(""),
    is_active: Joi.boolean().allow(""),
});

export const tendersUpdateVal = Joi.object({
    _id: Joi.string().required(),
    authority_name: Joi.string().required(),
    sectors: Joi.string().required(),
    regions: Joi.string().required(),
    cpv_codes: Joi.string().required(),
    address: Joi.string().allow(""),
    telephone: Joi.string().allow(""),
    fax_number: Joi.string().allow(""),
    email: Joi.string().allow(""),
    contact_person: Joi.string().allow(""),
    big_ref_no: Joi.string().required(),
    description: Joi.string().allow(""),
    tender_type: Joi.string().allow(""),
    tender_no: Joi.string().allow(""),
    funding_agency: Joi.string().allow(""),
    tender_competition: Joi.string().allow(""),
    published_date: Joi.string().allow(""),
    closing_date: Joi.string().allow(""),
    country: Joi.string().allow(""),
    emd: Joi.string().allow(""),
    estimated_cost: Joi.string().allow(""),
    documents: Joi.string().allow(""),
    is_active: Joi.boolean().allow(""),
});

export const tendersDeleteVal = Joi.object({
    _id: Joi.string().required()
});

export const tendersAddMultipleVal = Joi.object({
    tenders: Joi.array().items(
        Joi.object({
            authority_name: Joi.string().required(),
            sectors: Joi.string().required(),
            regions: Joi.string().required(),
            cpv_codes: Joi.string().required(),
            address: Joi.string().allow(""),
            telephone: Joi.string().allow(""),
            fax_number: Joi.string().allow(""),
            email: Joi.string().allow(""),
            contact_person: Joi.string().allow(""),
            description: Joi.string().allow(""),
            tender_type: Joi.string().allow(""),
            tender_no: Joi.string().allow(""),
            funding_agency: Joi.string().allow(""),
            tender_competition: Joi.string().allow(""),
            published_date: Joi.string().allow(""),
            closing_date: Joi.string().allow(""),
            country: Joi.string().allow(""),
            emd: Joi.string().allow(""),
            estimated_cost: Joi.string().allow(""),
            documents: Joi.string().allow(""),
            is_active: Joi.boolean().allow(""),
        })
    ).required("Tenders array are required")
});