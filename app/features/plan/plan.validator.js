import BaseJoi from "joi";
import JoiDate from "@joi/date";

const Joi = BaseJoi.extend(JoiDate);

export const subscribeV = Joi.object({
    plan_id: Joi.string().required(),
    categories: Joi.array().optional(),
    formData:Joi.object().optional()
});
export const subscribeCustomerV = Joi.object({
    plan_request_id: Joi.string().required(),
});