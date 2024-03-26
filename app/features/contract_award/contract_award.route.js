"use strict";
import express from "express";
import reqValidator from "../../middlewares/req.validator.js";

import {
    contractAwardAllListVal, contractAwardGetVal, contractAwardAddVal, contractAwardAddMultipleVal, contractAwardUpdateVal, contractAwardDeleteVal,
} from "./contract_award.validator.js";
import {
    contractAwardAllList, contractAwardGet, contractAwardAdd, contractAwardAddMultiple, contractAwardUpdate, contractAwardDelete
} from "./contract_award.controller.js";
import { addAuthUserIfExist, authenticateUser } from "../../middlewares/authentication.js";

const router = express.Router();

router.get("/list", addAuthUserIfExist, reqValidator(contractAwardAllListVal), contractAwardAllList)
router.get("", addAuthUserIfExist, reqValidator(contractAwardGetVal), contractAwardGet);
router.post("", authenticateUser, reqValidator(contractAwardAddVal), contractAwardAdd);
router.post("/multiple", authenticateUser, reqValidator(contractAwardAddMultipleVal), contractAwardAddMultiple);
router.put("", authenticateUser, reqValidator(contractAwardUpdateVal), contractAwardUpdate);
router.delete("", authenticateUser, reqValidator(contractAwardDeleteVal), contractAwardDelete);

export default router;
