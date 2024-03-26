"use strict";

import mongoose from "mongoose";
import { responseSend } from "../../helpers/responseSend.js";
import { pushDataInCMS, readCmsRecord, removeDataInCMS, updateCmsRecords, updateDataInCMS } from "./cms.service.js";
import { readAllSectors } from "../masters/masters.service.js";
import { readAllTenders } from "../tenders/tenders.service.js";

export const getCmsRecords = async (req, res, next) => {
    try {
        const { type } = req.query;
        let select = {};
        select[type] = 1;

        const records = await readCmsRecord(
            { is_active: true },
            select
        );

        responseSend(res, 201, "Cms records fetched successfully", records ? records[req.query.type] : null);
    } catch (error) {
        next(error);
    }
};

export const updateAuthRecord = async (req, res, next) => {
    try {
        const updateData = await updateCmsRecords(
            { is_active: true },
            { auth_record: req.body },
            { auth_record: 1 }
        );

        responseSend(res, 201, "Auth records updated successfully", updateData?.auth_record);
    } catch (error) {
        next(error);
    }
};

export const updateSocialLink = async (req, res, next) => {
    try {
        const updateData = await updateCmsRecords(
            { is_active: true },
            { social_links: req.body },
            { social_links: 1 }
        );

        responseSend(res, 201, "Social records updated successfully", updateData?.social_links);
    } catch (error) {
        next(error);
    }
};

export const updateHomePageRecords = async (req, res, next) => {
    try {
        const updateData = await updateCmsRecords(
            { is_active: true },
            { home_page: req.body },
            { home_page: 1 }
        );

        responseSend(res, 201, "Home page records updated successfully", updateData?.home_page);
    } catch (error) {
        next(error);
    }
};

export const updateAboutPageRecords = async (req, res, next) => {
    try {
        req.body.list_description = JSON.parse(req.body.list_description);

        let payload = {
            ...req.body
        }
        if (req.files) {
            req.files.map(function (val, ind) {
                payload[val.fieldname] = val.path
            })
        }

        const updateData = await updateCmsRecords(
            { is_active: true },
            { about_us_page: payload },
            { about_us_page: 1 }
        );

        responseSend(res, 201, "About page records updated successfully", updateData?.about_us_page);
    } catch (error) {
        next(error);
    }
};

export const updateContactUsRecords = async (req, res, next) => {
    try {
        const updateData = await updateCmsRecords(
            { is_active: true },
            { contact_details: req.body },
            { contact_details: 1 }
        );

        responseSend(res, 201, "Contact us records updated successfully", updateData?.contact_details);
    } catch (error) {
        next(error);
    }
};

export const updateServiceInfo = async (req, res, next) => {
    try {
        const updateData = await updateCmsRecords(
            { is_active: true },
            { service_page: req.body },
            { service_page: 1 }
        );

        responseSend(res, 201, "Service page records updated successfully", updateData?.service_page);
    } catch (error) {
        next(error);
    }
};

export const updateServiceRecord = async (req, res, next) => {
    try {
        let result = {};

        if (req?.file?.path)
            req.body.image = req.file.path;

        if (req.body.delete) {
            result = await removeDataInCMS(
                { is_active: true },
                { "service_records": { _id: new mongoose.Types.ObjectId(req.body.id) } },
                { service_records: 1 }
            )
        } else if (req.body.id) {
            result = await updateDataInCMS(
                { is_active: true },
                {
                    "service_records.$[elem].image": req.body.image,
                    "service_records.$[elem].title": req.body.title,
                    "service_records.$[elem].description": req.body.description,
                },
                [
                    { 'elem._id': new mongoose.Types.ObjectId(req.body.id) }
                ],
                { service_records: 1 }
            )
        } else {
            result = await pushDataInCMS(
                { is_active: true },
                { service_records: req.body },
                { service_records: 1 }
            );
        }

        responseSend(res, 201, "Service page records updated successfully", result?.service_records);
    } catch (error) {
        next(error);
    }
};

export const updateEprocurmentInfo = async (req, res, next) => {
    try {
        const updateData = await updateCmsRecords(
            { is_active: true },
            { eprocurment_page: req.body },
            { eprocurment_page: 1 }
        );

        responseSend(res, 201, "Eprocurment page records updated successfully", updateData?.eprocurment_page);
    } catch (error) {
        next(error);
    }
};

export const updateEprocurmentRecord = async (req, res, next) => {
    try {
        let result = {};

        if (req.body.delete) {
            result = await removeDataInCMS(
                { is_active: true },
                { "eprocurment_records": { _id: new mongoose.Types.ObjectId(req.body._id) } },
                { eprocurment_records: 1 }
            )
        } else if (req.body._id) {
            result = await updateDataInCMS(
                { is_active: true },
                {
                    "eprocurment_records.$[elem].icon": req.body.icon,
                    "eprocurment_records.$[elem].label": req.body.label,
                },
                [
                    { 'elem._id': new mongoose.Types.ObjectId(req.body._id) }
                ],
                { eprocurment_records: 1 }
            )
        } else {
            result = await pushDataInCMS(
                { is_active: true },
                { eprocurment_records: req.body },
                { eprocurment_records: 1 }
            );
        }

        responseSend(res, 201, "Eprocurment page records updated successfully", result?.eprocurment_records);
    } catch (error) {
        next(error);
    }
};

export const updateGrantsInfo = async (req, res, next) => {
    try {
        const updateData = await updateCmsRecords(
            { is_active: true },
            { grants_info: req.body },
            { grants_info: 1 }
        );

        responseSend(res, 201, "Grants info updated successfully", updateData?.grants_info);
    } catch (error) {
        next(error);
    }
};

export const updateTendersInfo = async (req, res, next) => {
    try {
        const updateData = await updateCmsRecords(
            { is_active: true },
            { tenders_info: req.body },
            { tenders_info: 1 }
        );

        responseSend(res, 201, "Tenders info updated successfully", updateData?.tenders_info);
    } catch (error) {
        next(error);
    }
};

export const updateProjectInfo = async (req, res, next) => {
    try {
        const updateData = await updateCmsRecords(
            { is_active: true },
            { project_info: req.body },
            { project_info: 1 }
        );

        responseSend(res, 201, "Project info updated successfully", updateData?.project_info);
    } catch (error) {
        next(error);
    }
};

export const updateContractAwardInfo = async (req, res, next) => {
    try {
        const updateData = await updateCmsRecords(
            { is_active: true },
            { contract_award_info: req.body },
            { contract_award_info: 1 }
        );

        responseSend(res, 201, "Contract Award info updated successfully", updateData?.contract_award_info);
    } catch (error) {
        next(error);
    }
};