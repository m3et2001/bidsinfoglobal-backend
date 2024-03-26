"use strict";
import express from "express";
import reqValidator from "../../middlewares/req.validator.js";

import {
    tendersAllListVal, tendersGetVal, tendersAddVal, tendersAddMultipleVal, tendersUpdateVal, tendersDeleteVal,
} from "./tenders.validator.js";
import {
    tendersAllList, tendersGet, tendersAdd, tendersAddMultiple, tendersUpdate, tendersDelete
} from "./tenders.controller.js";
import { authenticateUser, addAuthUserIfExist } from "../../middlewares/authentication.js";

const router = express.Router();

router.get("/list", addAuthUserIfExist, reqValidator(tendersAllListVal), tendersAllList)
router.get("", addAuthUserIfExist, reqValidator(tendersGetVal), tendersGet);
router.post("", authenticateUser, reqValidator(tendersAddVal), tendersAdd);
router.post("/multiple", authenticateUser, reqValidator(tendersAddMultipleVal), tendersAddMultiple);
router.put("", authenticateUser, reqValidator(tendersUpdateVal), tendersUpdate);
router.delete("", authenticateUser, reqValidator(tendersDeleteVal), tendersDelete);

export default router;
