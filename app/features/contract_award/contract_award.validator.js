import BaseJoi from "joi";
import JoiDate from "@joi/date";
const Joi = BaseJoi.extend(JoiDate);

export const contractAwardAllListVal = Joi.object({
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

export const contractAwardGetVal = Joi.object({
  _id: Joi.string().allow(""),
  ref_no: Joi.string().allow(""),
});

export const contractAwardAddVal = Joi.object({
  org_name: Joi.string().required(),
  title: Joi.string().allow(""),
  org_address: Joi.string().allow(""),
  telephone_no: Joi.string().allow(""),
  fax_number: Joi.string().allow(""),
  email: Joi.string().allow(""),
  contact_person: Joi.string().allow(""),
  big_ref_no: Joi.string().allow(""),
  document_no: Joi.string().allow(""),
  bidding_type: Joi.string().allow(""),
  project_location: Joi.string().allow(""),
  contractor_details: Joi.string().allow(""),
  tender_notice_no: Joi.string().allow(""),
  description: Joi.string().allow(""),
  cpv_codes: Joi.string().allow(""),
  sectors: Joi.string().allow(""),
  regions: Joi.string().allow(""),
  funding_agency: Joi.string().allow(""),
  awards_publish_date: Joi.string().allow(""),
  is_active: Joi.boolean().allow(""),
});

export const contractAwardUpdateVal = Joi.object({
  _id: Joi.string().required(),
  title: Joi.string().allow(""),
  org_name: Joi.string().required(),
  org_address: Joi.string().allow(""),
  telephone_no: Joi.string().allow(""),
  fax_number: Joi.string().allow(""),
  email: Joi.string().allow(""),
  contact_person: Joi.string().allow(""),
  big_ref_no: Joi.string().allow(""),
  document_no: Joi.string().allow(""),
  bidding_type: Joi.string().allow(""),
  project_location: Joi.string().allow(""),
  contractor_details: Joi.string().allow(""),
  tender_notice_no: Joi.string().allow(""),
  description: Joi.string().allow(""),
  cpv_codes: Joi.string().allow(""),
  sectors: Joi.string().allow(""),
  regions: Joi.string().allow(""),
  funding_agency: Joi.string().allow(""),
  awards_publish_date: Joi.string().allow(""),
  is_active: Joi.boolean().allow(""),
});

export const contractAwardDeleteVal = Joi.object({
  _id: Joi.string().required(),
});

export const contractAwardAddMultipleVal = Joi.object({
  contracts: Joi.array()
    .items(
      Joi.object({
        org_name: Joi.string().required(),
        title: Joi.string().allow(""),
        org_address: Joi.string().allow(""),
        telephone_no: Joi.string().allow(""),
        fax_number: Joi.string().allow(""),
        email: Joi.string().allow(""),
        contact_person: Joi.string().allow(""),
        document_no: Joi.string().allow(""),
        bidding_type: Joi.string().allow(""),
        project_location: Joi.string().allow(""),
        contractor_details: Joi.string().allow(""),
        tender_notice_no: Joi.string().allow(""),
        description: Joi.string().allow(""),
        cpv_codes: Joi.string().allow(""),
        sectors: Joi.string().allow(""),
        regions: Joi.string().allow(""),
        funding_agency: Joi.string().allow(""),
        awards_publish_date: Joi.string().allow(""),
        is_active: Joi.boolean().allow(""),
      })
    )
    .required("Contracts required"),
});
