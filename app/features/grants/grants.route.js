"use strict";
import express from "express";
import reqValidator from "../../middlewares/req.validator.js";

import {
    grantsAllListVal, grantsGetVal, grantsAddVal, grantsUpdateVal, grantsDeleteVal, grantsAddMultipleVal
} from "./grants.validator.js";
import {
    grantsAllList, grantsGet, grantsAdd, grantsUpdate, grantsDelete, grantsAddMultiple
} from "./grants.controller.js";
import { addAuthUserIfExist, authenticateUser } from "../../middlewares/authentication.js";

const router = express.Router();

router.get("/list", addAuthUserIfExist, reqValidator(grantsAllListVal), grantsAllList)
router.get("", addAuthUserIfExist, reqValidator(grantsGetVal), grantsGet);
router.post("", authenticateUser, reqValidator(grantsAddVal), grantsAdd);
router.post("/multiple", authenticateUser, reqValidator(grantsAddMultipleVal), grantsAddMultiple);
router.put("", authenticateUser, reqValidator(grantsUpdateVal), grantsUpdate);
router.delete("", authenticateUser, reqValidator(grantsDeleteVal), grantsDelete);

export default router;
