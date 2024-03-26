'use strict';
import { Router } from "express";

import authRoutes from "../features/auth/auth.route.js";
import cmsRoutes from "../features/cms/cms.route.js";
import commonRoutes from "../features/common/common.route.js";
import grantsRoutes from "../features/grants/grants.route.js";
import mastersRoutes from "../features/masters/masters.route.js";
import contractAwardRoutes from "../features/contract_award/contract_award.route.js";
import projectsRoutes from "../features/projects/projects.route.js";
import tendersRoutes from "../features/tenders/tenders.route.js";
import planRoutes from "../features/plan/plan.route.js";
import reportsRoutes from "../features/reports/reports.route.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/cms", cmsRoutes);
router.use("/common", commonRoutes);
router.use("/grants", grantsRoutes);
router.use("/masters", mastersRoutes);
router.use("/contract-award", contractAwardRoutes);
router.use("/projects", projectsRoutes);
router.use("/tenders", tendersRoutes);
router.use("/plan", planRoutes);
router.use("/reports", reportsRoutes);

export default router;
