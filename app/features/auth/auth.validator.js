import BaseJoi from "joi";
import JoiDate from "@joi/date";
const Joi = BaseJoi.extend(JoiDate);

export const authCustLoginV = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

export const authPasswordV = Joi.object({
    old_password: Joi.string().required(),
    new_password: Joi.string().required(),
});

export const resetPasswordV = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().required(),
});

export const authLoginV = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const authCustomerRegisterV = Joi.object({
    full_name: Joi.string().required(),
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    phone_no: Joi.string().required(),
    organization_name: Joi.string().allow(""),
    website_url: Joi.string().allow(''),
    country: Joi.string().allow(''),
    plan_id: Joi.string().allow(''),
});

export const forgotPasswordV = Joi.object({
    username: Joi.string().required()
});

export const profileUpdateV = Joi.object({
    customer_id: Joi.string().allow(""),
    customer_type: Joi.string().allow(""),
    full_name: Joi.string().required(),
    email: Joi.string().required(),
    phone_no: Joi.string().required(),
    organization_name: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().allow(""),
    location: Joi.string().allow(""),
    pincode: Joi.string().allow(""),
    country: Joi.string().allow(""),
    telephone_no: Joi.string().allow(""),
    website_url: Joi.string().allow(""),
    products_services: Joi.string().allow(""),
    operation: Joi.string().allow(""),
    purchase_plan_id: Joi.any().allow(""),
    plan_expire_date: Joi.any().allow(""),
    received_amount: Joi.any().allow(""),
});


export const getCustomersList = Joi.object({
    pageNo: Joi.string().allow(""),
    limit: Joi.string().allow(""),
    sortBy: Joi.string().allow(""),
    sortField: Joi.string().allow(""),
    keywords: Joi.string().allow(""),
});

export const getUserList = Joi.object({
    pageNo: Joi.string().allow(""),
    limit: Joi.string().allow(""),
    sortBy: Joi.string().allow(""),
    sortField: Joi.string().allow(""),
    keywords: Joi.string().allow(""),
});

export const addUserVal = Joi.object({
    email: Joi.string().required(""),
    role: Joi.string().required(""),
    password: Joi.string().required(""),
});

export const updateCustomerStatus = Joi.object({
    customer_id: Joi.string().required(""),
    status: Joi.string().required(""),
});
export const customerId = Joi.object({
    customer_id: Joi.string().required(""),
});

export const businessProfileV = Joi.object({
    customer_id: Joi.string().allow(""),
    company_name: Joi.string().required(),
    contacts: Joi.string().required(),
    telephone_no: Joi.string().allow(""),
    official_email: Joi.string().required(),
    fax: Joi.string().allow(""),
    address: Joi.string().required(),
    city: Joi.string().required(),
    location: Joi.string().required(),
    pincode: Joi.string().allow(""),
    country: Joi.string().allow(""),
    website_url: Joi.string().allow(""),
    employee_strength: Joi.string().allow(""),
    industry_type: Joi.array().allow(""),
    business_area: Joi.string().allow(""),
    establishment_details: Joi.string().allow(""),
});

export const assignTendersV = Joi.object({
    customer_id: Joi.string().required(),
    data_id: Joi.array().required(),
    filter: Joi.object().required(),
});
