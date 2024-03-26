"use strict";
import express from "express";
import reqValidator from "../../middlewares/req.validator.js";

import {
    getCmsRecords,
    updateAuthRecord,
    updateSocialLink,
    updateHomePageRecords,
    updateAboutPageRecords,
    updateContactUsRecords,
    updateServiceRecord,
    updateServiceInfo,
    updateEprocurmentInfo,
    updateEprocurmentRecord,
    updateGrantsInfo,
    updateTendersInfo,
    updateProjectInfo,
    updateContractAwardInfo,
} from "./cms.controller.js";
import {
    cmsRecordValidator,
    authRecordValidator,
    socialLinkValidator,
    homePageValidator,
    aboutPageValidator,
    contactPageValidator,
    servicePageValidator,
    serviceRecordValidator,
    eprocurmentPageValidator,
    eprocurmentRecordValidator,
    grantsInfoValidator,
    tendersInfoValidator,
    projectInfoValidator,
    contractAwardInfoValidator,
} from "./cms.validator.js";
import { imageProcessingMultiple, imageProcessingSingle } from "../../middlewares/image.processing.js";
import { authenticateUser } from "../../middlewares/authentication.js";

const router = express.Router();

router.get(
    "/get-cms-data",
    reqValidator(cmsRecordValidator),
    getCmsRecords
)

router.post(
    "/auth-record-update",
    authenticateUser,
    reqValidator(authRecordValidator),
    updateAuthRecord
);

router.post(
    "/social-link-update",
    authenticateUser,
    reqValidator(socialLinkValidator),
    updateSocialLink
);

router.post(
    "/home-page-update",
    authenticateUser,
    reqValidator(homePageValidator),
    updateHomePageRecords
);

router.post(
    "/about-us-update",
    authenticateUser,
    imageProcessingMultiple,
    reqValidator(aboutPageValidator),
    updateAboutPageRecords
);

router.post(
    "/contact-us-update",
    authenticateUser,
    reqValidator(contactPageValidator),
    updateContactUsRecords
);

router.post(
    "/service-info-update",
    authenticateUser,
    reqValidator(servicePageValidator),
    updateServiceInfo
);

router.post(
    "/service-record-update",
    authenticateUser,
    imageProcessingSingle,
    reqValidator(serviceRecordValidator),
    updateServiceRecord
);


router.post(
    "/eprocurment-info-update",
    authenticateUser,
    reqValidator(eprocurmentPageValidator),
    updateEprocurmentInfo
);

router.post(
    "/eprocurment-record-update",
    authenticateUser,
    reqValidator(eprocurmentRecordValidator),
    updateEprocurmentRecord
);

router.post(
    "/grants-info-update",
    authenticateUser,
    reqValidator(grantsInfoValidator),
    updateGrantsInfo
);

router.post(
    "/tenders-info-update",
    authenticateUser,
    reqValidator(tendersInfoValidator),
    updateTendersInfo
);

router.post(
    "/project-info-update",
    authenticateUser,
    reqValidator(projectInfoValidator),
    updateProjectInfo
);

router.post(
    "/contract-award-info-update",
    authenticateUser,
    reqValidator(contractAwardInfoValidator),
    updateContractAwardInfo
);



export default router;
