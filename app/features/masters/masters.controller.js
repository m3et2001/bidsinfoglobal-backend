"use strict";

import { responseSend } from "../../helpers/responseSend.js";
import tendersModel from "../../models/tenders.model.js";
import { projectsCountByRegions, projectsCountBySectors } from "../projects/projects.service.js";
import { readAllTenders, tendersCountByCpvCodes, tendersCountByRegions, tendersCountBySector } from "../tenders/tenders.service.js";
import {
    insertCountry, readAllCountry, readCountry, updateCountry,
    insertStates, readAllStates, readStates, updateStates,
    insertRegions, readAllRegions, readRegions, updateRegions,
    insertSectors, readAllSectors, readSectors, updateSectors,
    insertCPVCodes, readAllCPVCodes, readCPVCodes, updateCPVCodes, readAllFundingAgency,
} from "./masters.service.js";

// country master api

const country_select_field = { name: 1, title: 1, description: 1, num_code: 1, str_code: 1, is_active: 1, createdAt: 1 };

export const countryAllList = async (req, res, next) => {
    try {
        const { keywords, pageNo, limit, sortBy, sortField } = req.query;
        let filter = { is_active: true, is_deleted: false };

        if (keywords && keywords !== "")
            filter = {
                ...filter,
                $or: [
                    { name: { $regex: keywords, $options: 'i' } },
                    { num_code: { $regex: keywords, $options: 'i' } },
                    { str_code: { $regex: keywords, $options: 'i' } }
                ]
            };

        let result = await readAllCountry(
            filter,
            country_select_field,
            { [sortField]: parseInt(sortBy) },
            parseInt(pageNo) * parseInt(limit),
            parseInt(limit),
        )

        if (req.query.by_tenders) {
            let tenders = await tendersModel.aggregate([
                {
                    $group: {
                        _id: { $toLower: "$country" },
                        count: {
                            $sum: 1
                        }
                    }
                }
            ])


            result.result.map(function (val, key) {
                let find = 0;
                if (val?.name)
                    find = tenders.find(obj => obj?._id?.toLowerCase() === val?.name?.toLowerCase());

                val.count = find?.count || 0;
            })


            // result = result.map(function(val, key) {
            //     return val.count = tenders.find((obj) => obj._id === )
            // })
        }

        responseSend(res, 201, "Country records", { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
};

export const countryGet = async (req, res, next) => {
    try {
        let result = await readCountry({ _id }, country_select_field);

        responseSend(res, 201, "Country single record", result);
    } catch (error) {
        next(error);
    }
}

export const countryAdd = async (req, res, next) => {
    try {
        let result = await insertCountry(req.body);

        responseSend(res, 201, "Country added successfully", result);
    } catch (error) {
        next(error);
    }
}

export const countryUpdate = async (req, res, next) => {
    try {
        const { _id } = req.body;

        let result = await updateCountry({ _id }, req.body);

        responseSend(res, 201, "Country updated successfully", result);
    } catch (error) {
        next(error);
    }
}

export const countryDelete = async (req, res, next) => {
    try {
        const { _id } = req.query;

        await updateCountry({ _id }, { is_deleted: true, is_active: false });

        responseSend(res, 201, "Country deleted successfully", {});
    } catch (error) {
        next(error);
    }
}

// states master api
const states_select_field = { country_id: 1, name: 1, code: 1, is_active: 1, createdAt: 1 };

export const statesAllList = async (req, res, next) => {
    try {
        const { keywords, pageNo, limit, sortBy, sortField } = req.query;
        let filter = { is_active: true, is_deleted: false };

        if (keywords && keywords !== "")
            filter = {
                ...filter,
                $or: [
                    { name: { $regex: keywords, $options: 'i' } },
                    { code: { $regex: keywords, $options: 'i' } },
                ]
            };

        let result = await readAllStates(
            filter,
            states_select_field,
            { [sortField]: parseInt(sortBy) },
            parseInt(pageNo) * parseInt(limit),
            parseInt(limit),
        )

        responseSend(res, 201, "States records", { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
};

export const statesGet = async (req, res, next) => {
    try {
        const { _id } = req.query;

        let result = await readStates({ _id }, states_select_field);

        responseSend(res, 201, "States single record", result);
    } catch (error) {
        next(error);
    }
}

export const statesAdd = async (req, res, next) => {
    try {
        let result = await insertStates(req.body);

        responseSend(res, 201, "States added successfully", result);
    } catch (error) {
        next(error);
    }
}

export const statesUpdate = async (req, res, next) => {
    try {
        const { _id } = req.body;

        let result = await updateStates({ _id }, req.body);

        responseSend(res, 201, "States updated successfully", result);
    } catch (error) {
        next(error);
    }
}

export const statesDelete = async (req, res, next) => {
    try {
        const { _id } = req.query;

        await updateStates({ _id }, { is_deleted: true, is_active: false });

        responseSend(res, 201, "States deleted successfully", {});
    } catch (error) {
        next(error);
    }
}

// regions master api
const regions_select_field = { name: 1, title: 1, description: 1, code: 1, is_active: 1, createdAt: 1 };

export const regionsAllList = async (req, res, next) => {
    try {
        const { keywords, pageNo, limit, sortBy, sortField, by_tenders_count, by_projects_count } = req.query;
        let filter = { is_active: true, is_deleted: false };

        if (keywords && keywords !== "")
            filter = {
                ...filter,
                $or: [
                    { name: { $regex: keywords, $options: 'i' } },
                    { code: { $regex: keywords, $options: 'i' } },
                ]
            };

        let result = await readAllRegions(
            filter,
            regions_select_field,
            { [sortField]: parseInt(sortBy) },
            parseInt(pageNo) * parseInt(limit),
            parseInt(limit),
        )

        if (by_tenders_count) {
            let regions = result.result.map(function (val) {
                return val.name
            });

            let countOfTender = await tendersCountByRegions(regions);

            result.result.map(function (val) {
                let find = countOfTender.find((obj) => obj._id === val.name);

                if (find) {
                    val.tenders_count = find.count;
                } else {
                    val.tenders_count = 0;
                }
            })
        }

        if (by_projects_count) {
            let regions = result.result.map(function (val) {
                return val.name
            });

            let countOfTender = await projectsCountByRegions(regions);

            result.result.map(function (val) {
                let find = countOfTender.find((obj) => obj._id === val.name);

                if (find) {
                    val.projects_count = find.count;
                } else {
                    val.projects_count = 0;
                }
            })
        }

        responseSend(res, 201, "Regions records", { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
};

export const regionsGet = async (req, res, next) => {
    try {
        const { _id } = req.query;

        let result = await readRegions({ _id }, regions_select_field);

        responseSend(res, 201, "Regions single record", result);
    } catch (error) {
        next(error);
    }
}

export const regionsAdd = async (req, res, next) => {
    try {
        let result = await insertRegions(req.body);

        responseSend(res, 201, "Regions added successfully", result);
    } catch (error) {
        next(error);
    }
}

export const regionsUpdate = async (req, res, next) => {
    try {
        const { _id } = req.body;

        let result = await updateRegions({ _id }, req.body);

        responseSend(res, 201, "Regions updated successfully", result);
    } catch (error) {
        next(error);
    }
}

export const regionsDelete = async (req, res, next) => {
    try {
        const { _id } = req.query;

        await updateRegions({ _id }, { is_deleted: true, is_active: false });

        responseSend(res, 201, "Regions deleted successfully", {});
    } catch (error) {
        next(error);
    }
}

// sectors master api
const sectors_select_field = { name: 1, code: 1, title: 1, description: 1, icon: 1, is_active: 1, createdAt: 1 };

export const sectorsAllList = async (req, res, next) => {
    try {
        const { by_tenders_count, by_projects_count, keywords, pageNo, limit, sortBy, sortField } = req.query;
        let filter = { is_active: true, is_deleted: false };

        if (keywords && keywords !== "")
            filter = {
                ...filter,
                $or: [
                    { name: { $regex: keywords, $options: 'i' } },
                    { code: { $regex: keywords, $options: 'i' } },
                ]
            };

        let result = await readAllSectors(
            filter,
            sectors_select_field,
            { [sortField]: parseInt(sortBy) },
            parseInt(pageNo) * parseInt(limit),
            parseInt(limit),
        )

        if (by_tenders_count) {
            let sectors = result.result.map(function (val) {
                return val.name
            });

            let countOfTender = await tendersCountBySector(sectors);

            result.result.map(function (val) {
                let find = countOfTender.find((obj) => obj._id === val.name);
                if (find) {
                    val.tenders_count = find.count;
                } else {
                    val.tenders_count = 0;
                }
            })
        }

        if (by_projects_count) {
            let regions = result.result.map(function (val) {
                return val.name
            });

            let countOfTender = await projectsCountBySectors(regions);

            result.result.map(function (val) {
                let find = countOfTender.find((obj) => obj._id === val.name);

                if (find) {
                    val.projects_count = find.count;
                } else {
                    val.projects_count = 0;
                }
            })
        }

        responseSend(res, 201, "Sectors records", { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
};

export const sectorsGet = async (req, res, next) => {
    try {
        const { _id } = req.query;

        let result = await readSectors({ _id }, sectors_select_field);

        responseSend(res, 201, "Sectors single record", result);
    } catch (error) {
        next(error);
    }
}

export const sectorsAdd = async (req, res, next) => {
    try {
        req.body.icon = req.file.path;
        let result = await insertSectors(req.body);

        responseSend(res, 201, "Sectors added successfully", result);
    } catch (error) {
        next(error);
    }
}

export const sectorsUpdate = async (req, res, next) => {
    try {
        const { _id } = req.body;

        if (req.file.path)
            req.body.icon = req.file.path;

        let result = await updateSectors({ _id }, req.body);

        responseSend(res, 201, "Sectors updated successfully", result);
    } catch (error) {
        next(error);
    }
}

export const sectorsDelete = async (req, res, next) => {
    try {
        const { _id } = req.query;

        await updateSectors({ _id }, { is_deleted: true, is_active: false });

        responseSend(res, 201, "Sectors deleted successfully", {});
    } catch (error) {
        next(error);
    }
}

// cpv codes master api
const cpvcodes_select_field = { code: 1, description: 1, is_active: 1, createdAt: 1 };

export const cpvcodesAllList = async (req, res, next) => {
    try {
        const { by_tenders_count, keywords, pageNo, limit, sortBy, sortField } = req.query;
        let filter = { is_active: true, is_deleted: false };

        if (keywords && keywords !== "")
            filter = {
                ...filter,
                $or: [
                    { description: { $regex: keywords, $options: 'i' } },
                    { code: { $regex: keywords, $options: 'i' } },
                ]
            };

        let result = await readAllCPVCodes(
            filter,
            cpvcodes_select_field,
            { [sortField]: parseInt(sortBy) },
            parseInt(pageNo) * parseInt(limit),
            parseInt(limit),
        )

        if (by_tenders_count) {
            let cpvCodes = result.result.map(function (val) {
                return val.code
            });

            let countOfTender = await tendersCountByCpvCodes(cpvCodes);

            result.result.map(function (val) {
                let find = countOfTender.find((obj) => obj._id === val.code);
                if (find) {
                    val.tenders_count = find.count;
                } else {
                    val.tenders_count = 0;
                }
            })
        }

        responseSend(res, 201, "CPV Codes records", { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
};

export const cpvcodesGet = async (req, res, next) => {
    try {
        const { _id } = req.query;

        let result = await readCPVCodes({ _id }, cpvcodes_select_field);

        responseSend(res, 201, "CPV Codes single record", result);
    } catch (error) {
        next(error);
    }
}

export const cpvcodesAdd = async (req, res, next) => {
    try {
        let result = await insertCPVCodes(req.body);

        responseSend(res, 201, "CPV Codes added successfully", result);
    } catch (error) {
        next(error);
    }
}

export const cpvcodesUpdate = async (req, res, next) => {
    try {
        const { _id } = req.body;

        let result = await updateCPVCodes({ _id }, req.body);

        responseSend(res, 201, "CPV Codes updated successfully", result);
    } catch (error) {
        next(error);
    }
}

export const cpvcodesDelete = async (req, res, next) => {
    try {
        const { _id } = req.query;

        await updateCPVCodes({ _id }, { is_deleted: true, is_active: false });

        responseSend(res, 201, "CPV Codes deleted successfully", {});
    } catch (error) {
        next(error);
    }
}

// cpv codes master api
const fundingAgency_select_field = { title: 1, is_active: 1, createdAt: 1 };

export const fundingAgencyAllList = async (req, res, next) => {
    try {
        const { keywords, pageNo, limit, sortBy, sortField } = req.query;
        let filter = { is_active: true, is_deleted: false };

        if (keywords && keywords !== "")
            filter = {
                ...filter,
                $or: [
                    { title: { $regex: keywords, $options: 'i' } },
                ]
            };

        let result = await readAllFundingAgency(
            filter,
            fundingAgency_select_field,
            { [sortField]: parseInt(sortBy) },
            parseInt(pageNo) * parseInt(limit),
            parseInt(limit),
        )

        responseSend(res, 201, "Funding Agency records", { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
};

export const fundingAgencyGet = async (req, res, next) => {
    try {
        const { _id } = req.query;

        let result = await readFundingAgency({ _id }, fundingAgency_select_field);

        responseSend(res, 201, "Funding Agency single record", result);
    } catch (error) {
        next(error);
    }
}

export const fundingAgencyAdd = async (req, res, next) => {
    try {
        let result = await insertFundingAgency(req.body);

        responseSend(res, 201, "Funding Agency added successfully", result);
    } catch (error) {
        next(error);
    }
}

export const fundingAgencyUpdate = async (req, res, next) => {
    try {
        const { _id } = req.body;

        let result = await updateFundingAgency({ _id }, req.body);

        responseSend(res, 201, "Funding Agency updated successfully", result);
    } catch (error) {
        next(error);
    }
}

export const fundingAgencyDelete = async (req, res, next) => {
    try {
        const { _id } = req.query;

        await updateFundingAgency({ _id }, { is_deleted: true, is_active: false });

        responseSend(res, 201, "Funding Agency deleted successfully", {});
    } catch (error) {
        next(error);
    }
}