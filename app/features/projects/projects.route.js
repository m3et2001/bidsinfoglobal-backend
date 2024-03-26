"use strict";
import express from "express";
import reqValidator from "../../middlewares/req.validator.js";

import {
    projectsAllListVal, projectsGetVal, projectsAddVal, projectsAddMultipleVal, projectsUpdateVal, projectsDeleteVal,
} from "./projects.validator.js";
import {
    projectsAllList, projectsGet, projectsAdd, projectsAddMultiple, projectsUpdate, projectsDelete
} from "./projects.controller.js";
import { addAuthUserIfExist, authenticateUser } from "../../middlewares/authentication.js";

const router = express.Router();

router.get("/list", addAuthUserIfExist, reqValidator(projectsAllListVal), projectsAllList)
router.get("", addAuthUserIfExist, reqValidator(projectsGetVal), projectsGet);
router.post("", authenticateUser, reqValidator(projectsAddVal), projectsAdd);
router.post("/multiple", authenticateUser, reqValidator(projectsAddMultipleVal), projectsAddMultiple);
router.put("", authenticateUser, reqValidator(projectsUpdateVal), projectsUpdate);
router.delete("", authenticateUser, reqValidator(projectsDeleteVal), projectsDelete);

export default router;
