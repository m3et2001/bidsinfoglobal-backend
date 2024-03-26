"use strict";
import express from "express";
import reqValidator from "../../middlewares/req.validator.js";

import { getPlansList, subscribePlan, getPlanRequestList, subscribePlanToCustomer } from "./plan.controller.js";
import { subscribeV, subscribeCustomerV } from "./plan.validator.js";
import { authenticateUser } from "../../middlewares/authentication.js";

const router = express.Router();

// ---------- admin apis ----------- //

router.get(
    "/list",
    getPlansList
)

router.post(
    "/activate-request",
    authenticateUser,
    reqValidator(subscribeCustomerV),
    subscribePlanToCustomer
)

// ---------- customer apis ----------- //

router.post(
    "/subscribe",
    authenticateUser,
    reqValidator(subscribeV),
    subscribePlan
)

// ---------- plan request apis ----------- //

router.get(
    "/request",
    authenticateUser,
    getPlanRequestList
)

export default router;