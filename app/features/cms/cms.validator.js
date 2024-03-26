import BaseJoi from "joi";
import JoiDate from "@joi/date";
const Joi = BaseJoi.extend(JoiDate);

export const cmsRecordValidator = Joi.object({
    type: Joi.string().required()
});

export const authRecordValidator = Joi.object({
    forget_password: Joi.string().required(),
    login_title: Joi.string().required(),
    login_description: Joi.string().allow(""),
    register_title: Joi.string().required(),
    register_description: Joi.string().allow(""),
});

export const socialLinkValidator = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(""),
    twitter: Joi.string().allow(""),
    facebook: Joi.string().allow(""),
    instagram: Joi.string().allow(""),
    skype: Joi.string().allow(""),
    linkedin: Joi.string().allow(""),
    whatsapp: Joi.string().allow(""),
});

export const homePageValidator = Joi.object({
    category_title: Joi.string().required(),
    category_description: Joi.string().allow(""),
    category_data: Joi.array().required(),
    tender_title: Joi.string().required(),
    tender_description: Joi.string().allow(""),
    global_tender_data: Joi.array().required(),
    indian_tender_data: Joi.array().required(),
});

export const aboutPageValidator = Joi.object({
    title_one: Joi.string().required(),
    sub_title_one: Joi.string().allow(""),
    description_title_one: Joi.string().required(),
    description_one: Joi.string().allow(""),
    title_two: Joi.string().required(),
    sub_title_two: Joi.string().allow(""),
    list_description: Joi.string().required(),
    image_one: Joi.string().allow(""),
    image_two: Joi.string().allow(""),
    files: Joi.allow("")
});

export const contactPageValidator = Joi.object({
    contact_title: Joi.string().required(),
    contact_description: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().required(),
    address: Joi.string().required(),
    google_map_url: Joi.string().required()
});

export const servicePageValidator = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required()
});

export const serviceRecordValidator = Joi.object({
    delete: Joi.string().allow(""),
    id: Joi.string().allow(""),
    title: Joi.string().required(),
    description: Joi.string().required()
});

export const eprocurmentPageValidator = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(""),
    drop_demo_title: Joi.string().required(),
    drop_demo_description: Joi.string().allow("")
});

export const eprocurmentRecordValidator = Joi.object({
    delete: Joi.string().allow(""),
    _id: Joi.string().allow(""),
    label: Joi.string().required(),
    icon: Joi.string().required()
});

export const grantsInfoValidator = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required()
});

export const tendersInfoValidator = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required()
});

export const projectInfoValidator = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required()
});

export const contractAwardInfoValidator = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required()
});