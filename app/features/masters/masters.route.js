"use strict";
import express from "express";
import reqValidator from "../../middlewares/req.validator.js";

import {
    countryAllListVal, countryGetVal, countryAddVal, countryUpdateVal, countryDeleteVal,
    statesAllListVal, statesGetVal, statesAddVal, statesUpdateVal, statesDeleteVal,
    regionsAllListVal, regionsGetVal, regionsAddVal, regionsUpdateVal, regionsDeleteVal,
    sectorsAllListVal, sectorsGetVal, sectorsAddVal, sectorsUpdateVal, sectorsDeleteVal,
    cpvcodesAllListVal, cpvcodesGetVal, cpvcodesAddVal, cpvcodesUpdateVal, cpvcodesDeleteVal, fundingAgencyAllListVal, fundingAgencyGetVal, fundingAgencyAddVal, fundingAgencyUpdateVal, fundingAgencyDeleteVal,
    citiesAllListVal,
    citiesGetVal,
    cityAddVal,
    cityUpdateVal,
    cityDeleteVal,
    // mailContentAllListVal, mailContentGetVal, mailContentAddVal, mailContentUpdateVal, mailContentDeleteVal,
} from "./masters.validator.js";

import {
    countryAllList, countryGet, countryAdd, countryUpdate, countryDelete,
    statesAllList, statesGet, statesAdd, statesUpdate, statesDelete,
    regionsAllList, regionsGet, regionsAdd, regionsUpdate, regionsDelete,
    sectorsAllList, sectorsGet, sectorsAdd, sectorsUpdate, sectorsDelete,
    cpvcodesAllList, cpvcodesGet, cpvcodesAdd, cpvcodesUpdate, cpvcodesDelete,
    fundingAgencyAllList, fundingAgencyGet, fundingAgencyAdd, fundingAgencyUpdate, fundingAgencyDelete,
    citiesAllList,
    citiesGet,
    cityAdd,
    cityUpdate,
    cityDelete,
    // mailContentAllList, mailContentGet, mailContentAdd, mailContentUpdate, mailContentDelete,
} from "./masters.controller.js";

import { authenticateUser } from "../../middlewares/authentication.js";
import { imageProcessingSingle } from "../../middlewares/image.processing.js";

const router = express.Router();

// country master apis
router.get("/country-all", reqValidator(countryAllListVal), countryAllList);
router.get("/country", authenticateUser, reqValidator(countryGetVal), countryGet);
router.post("/country", authenticateUser, reqValidator(countryAddVal), countryAdd);
router.put("/country", authenticateUser, reqValidator(countryUpdateVal), countryUpdate);
router.delete("/country", authenticateUser, reqValidator(countryDeleteVal), countryDelete);

// states master apis
router.get("/states-all", reqValidator(statesAllListVal), statesAllList);
router.get("/states", authenticateUser, reqValidator(statesGetVal), statesGet);
router.post("/states", authenticateUser, reqValidator(statesAddVal), statesAdd);
router.put("/states", authenticateUser, reqValidator(statesUpdateVal), statesUpdate);
router.delete("/states", authenticateUser, reqValidator(statesDeleteVal), statesDelete);
// states master apis
router.get("/city-all", reqValidator(citiesAllListVal), citiesAllList);
router.get("/cities", authenticateUser, reqValidator(citiesGetVal), citiesGet);
router.post("/cities", authenticateUser, reqValidator(cityAddVal), cityAdd);
router.put("/cities", authenticateUser, reqValidator(cityUpdateVal), cityUpdate);
router.delete("/cities", authenticateUser, reqValidator(cityDeleteVal), cityDelete);

// region master apis
router.get("/regions-all", reqValidator(regionsAllListVal), regionsAllList);
router.get("/regions", authenticateUser, reqValidator(regionsGetVal), regionsGet);
router.post("/regions", authenticateUser, reqValidator(regionsAddVal), regionsAdd);
router.put("/regions", authenticateUser, reqValidator(regionsUpdateVal), regionsUpdate);
router.delete("/regions", authenticateUser, reqValidator(regionsDeleteVal), regionsDelete);

// sector master apis
router.get("/sectors-all", reqValidator(sectorsAllListVal), sectorsAllList);
router.get("/sectors", authenticateUser, reqValidator(sectorsGetVal), sectorsGet);
router.post("/sectors", authenticateUser, imageProcessingSingle, reqValidator(sectorsAddVal), sectorsAdd);
router.put("/sectors", authenticateUser, imageProcessingSingle, reqValidator(sectorsUpdateVal), sectorsUpdate);
router.delete("/sectors", authenticateUser, reqValidator(sectorsDeleteVal), sectorsDelete);

// sector master apis
router.get("/cpv-codes-all", reqValidator(cpvcodesAllListVal), cpvcodesAllList);
router.get("/cpv-codes", authenticateUser, reqValidator(cpvcodesGetVal), cpvcodesGet);
router.post("/cpv-codes", authenticateUser, reqValidator(cpvcodesAddVal), cpvcodesAdd);
router.put("/cpv-codes", authenticateUser, reqValidator(cpvcodesUpdateVal), cpvcodesUpdate);
router.delete("/cpv-codes", authenticateUser, reqValidator(cpvcodesDeleteVal), cpvcodesDelete);

// funding agency apis
router.get("/funding-agency-all", reqValidator(fundingAgencyAllListVal), fundingAgencyAllList);
router.get("/funding-agency", authenticateUser, reqValidator(fundingAgencyGetVal), fundingAgencyGet);
router.post("/funding-agency", authenticateUser, reqValidator(fundingAgencyAddVal), fundingAgencyAdd);
router.put("/funding-agency", authenticateUser, reqValidator(fundingAgencyUpdateVal), fundingAgencyUpdate);
router.delete("/funding-agency", authenticateUser, reqValidator(fundingAgencyDeleteVal), fundingAgencyDelete);

// mail content master apis
// router.get("/mail-content-all", reqValidator(mailContentAllListVal), mailContentAllList);
// router.get("/mail-content", authenticateUser, reqValidator(mailContentGetVal), mailContentGet);
// router.post("/mail-content", authenticateUser, reqValidator(mailContentAddVal), mailContentAdd);
// router.put("/mail-content", authenticateUser, reqValidator(mailContentUpdateVal), mailContentUpdate);
// router.delete("/mail-content", authenticateUser, reqValidator(mailContentDeleteVal), mailContentDelete);

export default router;
