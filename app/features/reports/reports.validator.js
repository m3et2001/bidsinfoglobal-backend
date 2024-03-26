import BaseJoi from "joi";
import JoiDate from "@joi/date";
const Joi = BaseJoi.extend(JoiDate);

export const customerReports = Joi.object({
    from_date: Joi.string().required(),
    to_date: Joi.string().required(),
});

export const customerReportsList = Joi.object({
    pageNo: Joi.string().allow(""),
    limit: Joi.string().allow(""),
    sortBy: Joi.string().allow(""),
    sortField: Joi.string().allow(""),
    type: Joi.string().allow(""),
});