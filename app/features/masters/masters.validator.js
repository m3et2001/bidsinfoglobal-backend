import BaseJoi from "joi";
import JoiDate from "@joi/date";
const Joi = BaseJoi.extend(JoiDate);

//  country validation
export const countryAllListVal = Joi.object({
  pageNo: Joi.string().allow(""),
  limit: Joi.string().allow(""),
  sortBy: Joi.string().allow(""),
  sortField: Joi.string().allow(""),
  keywords: Joi.string().allow(""),
  by_tenders: Joi.string().allow(""),
});

export const countryGetVal = Joi.object({
  _id: Joi.string().required(),
});

export const countryAddVal = Joi.object({
  name: Joi.string().required(),
  title: Joi.string().allow(""),
  description: Joi.string().allow(""),
  num_code: Joi.string().required(),
  str_code: Joi.string().required(),
  is_active: Joi.boolean().allow(""),
});

export const countryUpdateVal = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().allow(""),
  title: Joi.string().allow(""),
  description: Joi.string().allow(""),
  num_code: Joi.string().allow(""),
  str_code: Joi.string().allow(""),
  is_active: Joi.boolean().allow(""),
});

export const countryDeleteVal = Joi.object({
  _id: Joi.string().required(),
});

//  states validation
export const statesAllListVal = Joi.object({
  pageNo: Joi.string().allow(""),
  limit: Joi.string().allow(""),
  sortBy: Joi.string().allow(""),
  sortField: Joi.string().allow(""),
  keywords: Joi.string().allow(""),
});
export const statesGetVal = Joi.object({
  _id: Joi.string().required(),
});

export const statesAddVal = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
  is_active: Joi.boolean().allow(""),
});

export const statesUpdateVal = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().allow(""),
  code: Joi.string().allow(""),
  is_active: Joi.boolean().allow(""),
});

export const statesDeleteVal = Joi.object({
  _id: Joi.string().required(),
});
//  cities validation
export const citiesAllListVal = Joi.object({
  pageNo: Joi.string().allow(""),
  limit: Joi.string().allow(""),
  sortBy: Joi.string().allow(""),
  sortField: Joi.string().allow(""),
  keywords: Joi.string().allow(""),
});
export const citiesGetVal = Joi.object({
  _id: Joi.string().required(),
});
export const cityAddVal = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().allow(""),
  state_name: Joi.string().allow(""),
  towns: Joi.array(),
  is_active: Joi.boolean().allow(""),
});
export const cityUpdateVal = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().allow(""),
  code: Joi.string().allow(""),
  state_name: Joi.string().allow(""),
  towns: Joi.array(),
  is_active: Joi.boolean().allow(""),
});
export const cityDeleteVal = Joi.object({
    _id: Joi.string().required(),
  });

//  region validation
export const regionsAllListVal = Joi.object({
  pageNo: Joi.string().allow(""),
  limit: Joi.string().allow(""),
  sortBy: Joi.string().allow(""),
  sortField: Joi.string().allow(""),
  keywords: Joi.string().allow(""),
  by_tenders_count: Joi.string().allow(""),
  by_projects_count: Joi.string().allow(""),
});

export const regionsGetVal = Joi.object({
  _id: Joi.string().required(),
});

export const regionsAddVal = Joi.object({
  name: Joi.string().required(),
  title: Joi.string().allow(""),
  description: Joi.string().allow(""),
  project_title: Joi.string().allow(""),
  project_description: Joi.string().allow(""),
  code: Joi.string().required(),
  is_active: Joi.boolean().allow(""),
});

export const regionsUpdateVal = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().allow(""),
  title: Joi.string().allow(""),
  description: Joi.string().allow(""),
  project_title: Joi.string().allow(""),
  project_description: Joi.string().allow(""),
  code: Joi.string().allow(""),
  is_active: Joi.boolean().allow(""),
});

export const regionsDeleteVal = Joi.object({
  _id: Joi.string().required(),
});

//  sectors validation
export const sectorsAllListVal = Joi.object({
  pageNo: Joi.string().allow(""),
  limit: Joi.string().allow(""),
  sortBy: Joi.string().allow(""),
  sortField: Joi.string().allow(""),
  keywords: Joi.string().allow(""),
  by_tenders_count: Joi.string().allow(""),
  by_projects_count: Joi.string().allow(""),
});

export const sectorsGetVal = Joi.object({
  _id: Joi.string().required(),
});

export const sectorsAddVal = Joi.object({
  name: Joi.string().required(),
  title: Joi.string().allow(""),
  description: Joi.string().allow(""),
  project_title: Joi.string().allow(""),
  project_description: Joi.string().allow(""),
  code: Joi.string().required(),
  is_active: Joi.boolean().allow(""),
});

export const sectorsUpdateVal = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().allow(""),
  title: Joi.string().allow(""),
  description: Joi.string().allow(""),
  project_title: Joi.string().allow(""),
  project_description: Joi.string().allow(""),
  code: Joi.string().allow(""),
  is_active: Joi.boolean().allow(""),
});

export const sectorsDeleteVal = Joi.object({
  _id: Joi.string().required(),
});

//  cpv codes validation
export const cpvcodesAllListVal = Joi.object({
  pageNo: Joi.string().allow(""),
  limit: Joi.string().allow(""),
  sortBy: Joi.string().allow(""),
  sortField: Joi.string().allow(""),
  keywords: Joi.string().allow(""),
  by_tenders_count: Joi.string().allow(""),
});

export const cpvcodesGetVal = Joi.object({
  _id: Joi.string().required(),
});

export const cpvcodesAddVal = Joi.object({
  code: Joi.string().required(),
  description: Joi.string().required(),
  is_active: Joi.boolean().allow(""),
});

export const cpvcodesUpdateVal = Joi.object({
  _id: Joi.string().required(),
  code: Joi.string().allow(""),
  description: Joi.string().allow(""),
  is_active: Joi.boolean().allow(""),
});

export const cpvcodesDeleteVal = Joi.object({
  _id: Joi.string().required(),
});

//  funding agency validation
export const fundingAgencyAllListVal = Joi.object({
  pageNo: Joi.string().allow(""),
  limit: Joi.string().allow(""),
  sortBy: Joi.string().allow(""),
  sortField: Joi.string().allow(""),
  keywords: Joi.string().allow(""),
});

export const fundingAgencyGetVal = Joi.object({
  _id: Joi.string().required(),
});

export const fundingAgencyAddVal = Joi.object({
  title: Joi.string().required(),
  is_active: Joi.boolean().allow(""),
});

export const fundingAgencyUpdateVal = Joi.object({
  _id: Joi.string().required(),
  title: Joi.string().allow(""),
  is_active: Joi.boolean().allow(""),
});

export const fundingAgencyDeleteVal = Joi.object({
  _id: Joi.string().required(),
});

//  mail content validation
export const mailContentAllListVal = Joi.object({
  pageNo: Joi.string().allow(""),
  limit: Joi.string().allow(""),
  sortBy: Joi.string().allow(""),
  sortField: Joi.string().allow(""),
  keywords: Joi.string().allow(""),
});

export const mailContentGetVal = Joi.object({
  _id: Joi.string().required(),
});

export const mailContentAddVal = Joi.object({
  type: Joi.string().required(),
  subject: Joi.string().required(),
  cc: Joi.string().allow(""),
  body: Joi.string().required(),
  fields: Joi.array().required(),
});

export const mailContentUpdateVal = Joi.object({
  _id: Joi.string().required(),
  type: Joi.string().required(),
  subject: Joi.string().required(),
  cc: Joi.string().allow(""),
  body: Joi.string().required(),
  fields: Joi.array().required(),
});

export const mailContentDeleteVal = Joi.object({
  _id: Joi.string().required(),
});
