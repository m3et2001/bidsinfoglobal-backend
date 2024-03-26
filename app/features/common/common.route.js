"use strict";
import express from "express";
import reqValidator from "../../middlewares/req.validator.js";

import { validateDemoRequest, validateContactUs, validateAdvanceSearch } from "./common.validator.js";
import { handleDemoRequest, listDemoRequest, contactUsSubmit, listContactUs, advanceSearch, dashboardData } from "./common.controller.js";
import { authenticateUser } from "../../middlewares/authentication.js";

const router = express.Router();

router.post(
    "/demo-request",
    reqValidator(validateDemoRequest),
    handleDemoRequest
)

router.get(
    "/demo-request",
    listDemoRequest
)

router.post(
    "/contact-us",
    reqValidator(validateContactUs),
    contactUsSubmit
)

router.get(
    "/contact-us",
    listContactUs
)

router.post(
    "/advance-search",
    reqValidator(validateAdvanceSearch),
    advanceSearch
)

router.get(
    "/dashboard",
    authenticateUser,
    dashboardData
)

export default router;
