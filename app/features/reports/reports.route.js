"use strict";
import express from "express";

import { getCustomerReports, generateCustomerReports } from "./reports.controller.js";
import { authenticateUser } from "../../middlewares/authentication.js";
import reqValidator from "../../middlewares/req.validator.js";
import { customerReports, customerReportsList } from "./reports.validator.js";

const router = express.Router();

router.get(
    "/customer-reports",
    authenticateUser,
    reqValidator(customerReportsList),
    getCustomerReports
)

router.post(
    "/customer-reports",
    authenticateUser,
    reqValidator(customerReports),
    generateCustomerReports
)

export default router;