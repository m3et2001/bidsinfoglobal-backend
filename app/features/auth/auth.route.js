"use strict";
import express from "express";
import reqValidator from "../../middlewares/req.validator.js";

import { customerLogin, userLogin, customerRegister, customerForgotPassword, customersList, customerProfileUpdate, customersStatusUpdate, getLoggedInCustomer, assignTendersToCustomer, getLoggedInBusinessProfile, businessProfileUpdate, updateCustomerPassword, usersList, usersAdd, resetCustomerPassword } from "./auth.controller.js";
import { authLoginV, authCustomerRegisterV, forgotPasswordV, profileUpdateV, authCustLoginV, getCustomersList, updateCustomerStatus, businessProfileV, authPasswordV, assignTendersV, getUserList, addUserVal, resetPasswordV } from "./auth.validator.js";
import { authenticateUser } from "../../middlewares/authentication.js";

const router = express.Router();

router.get(
    "/customer",
    authenticateUser,
    getLoggedInCustomer
)

router.post(
    "/customer-profile",
    reqValidator(profileUpdateV),
    authenticateUser,
    customerProfileUpdate
);

router.get(
    "/customers",
    authenticateUser,
    reqValidator(getCustomersList),
    customersList
);

router.put(
    "/customers-status",
    authenticateUser,
    reqValidator(updateCustomerStatus),
    customersStatusUpdate
);

router.get(
    "/business",
    authenticateUser,
    getLoggedInBusinessProfile
)

router.post(
    "/business-profile",
    reqValidator(businessProfileV),
    authenticateUser,
    businessProfileUpdate
);

router.post(
    "/customer-register",
    reqValidator(authCustomerRegisterV),
    customerRegister
);

router.post(
    "/customer-login",
    reqValidator(authCustLoginV),
    customerLogin
);

router.post(
    "/password-update",
    authenticateUser,
    reqValidator(authPasswordV),
    updateCustomerPassword
);

router.post(
    "/reset-password",
    reqValidator(resetPasswordV),
    resetCustomerPassword
);

//  ------------- admin api ----------- //
router.post(
    "/user-login",
    reqValidator(authLoginV),
    (req, res, next) => {
        userLogin(req, res, next);
    }
)

router.get(
    "/users",
    authenticateUser,
    reqValidator(getUserList),
    usersList
)

router.post(
    "/users",
    authenticateUser,
    reqValidator(addUserVal),
    usersAdd
)

router.post(
    "/forgot-password",
    reqValidator(forgotPasswordV),
    (req, res, next) => {
        customerForgotPassword(req, res, next);
    }
);

router.post(
    "/assign-tenders",
    authenticateUser,
    reqValidator(assignTendersV),
    assignTendersToCustomer
)

export default router;