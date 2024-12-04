import BaseJoi from "joi";
import JoiDate from "@joi/date";
const Joi = BaseJoi.extend(JoiDate);

export const grantsAllListVal = Joi.object({
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
    search_type: Joi.string().allow(""),
    from_date: Joi.string().allow(""),
    to_date: Joi.string().allow(""),
});

export const grantsGetVal = Joi.object({
    _id: Joi.string().allow(""),
    ref_no: Joi.string().allow(""),
});

export const grantsAddVal = Joi.object({
    donor: Joi.string().required(),
    contact_information: Joi.string().allow(""),
    title: Joi.string().allow(""),
    location: Joi.string().allow(""),
    big_ref_no: Joi.string().allow(""),
    title: Joi.string().allow(""),
    type: Joi.string().allow(""),
    status: Joi.string().allow(""),
    value: Joi.string().allow(""),
    type_of_services: Joi.string().allow(""),
    sectors: Joi.string().allow(""),
    regions: Joi.string().allow(""),
    funding_agency: Joi.string().allow(""),
    cpv_codes: Joi.string().allow(""),
    deadline: Joi.string().allow(""),
    duration: Joi.string().allow(""),
    attachment: Joi.string().allow(""),
    post_date: Joi.string().allow(""),
    is_active: Joi.boolean().allow(""),
});

export const grantsAddMultipleVal = Joi.object({
    grants: Joi.array().items(
        Joi.object({
            donor: Joi.string().required(),
            contact_information: Joi.string().allow(""),
            location: Joi.string().allow(""),
            big_ref_no: Joi.string().allow(""),
            title: Joi.string().allow(""),
            type: Joi.string().allow(""),
            status: Joi.string().allow(""),
            value: Joi.string().allow(""),
            type_of_services: Joi.string().allow(""),
            sectors: Joi.string().allow(""),
            regions: Joi.string().allow(""),
            funding_agency: Joi.string().allow(""),
            cpv_codes: Joi.string().allow(""),
            deadline: Joi.string().allow(""),
            duration: Joi.string().allow(""),
            attachment: Joi.string().allow(""),
            post_date: Joi.string().allow(""),
            is_active: Joi.boolean().allow(""),
        })
    ).required("Grants required")

});

export const grantsUpdateVal = Joi.object({
    _id: Joi.string().required(),
    title: Joi.string().allow(""),
    donor: Joi.string().required(),
    contact_information: Joi.string().allow(""),
    location: Joi.string().allow(""),
    big_ref_no: Joi.string().allow(""),
    title: Joi.string().allow(""),
    type: Joi.string().allow(""),
    status: Joi.string().allow(""),
    value: Joi.string().allow(""),
    type_of_services: Joi.string().allow(""),
    sectors: Joi.string().allow(""),
    regions: Joi.string().allow(""),
    funding_agency: Joi.string().allow(""),
    cpv_codes: Joi.string().allow(""),
    deadline: Joi.string().allow(""),
    duration: Joi.string().allow(""),
    attachment: Joi.string().allow(""),
    post_date: Joi.string().allow(""),
    is_active: Joi.boolean().allow("")
});

export const grantsDeleteVal = Joi.object({
    _id: Joi.string().required()
});