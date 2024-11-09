"use strict";

import { GenerateUserName } from "../../helpers/common.js";
import { customerStatus, mailSubject } from "../../helpers/constance.js";
import { responseSend } from "../../helpers/responseSend.js";
import { generateSession } from "../../helpers/tokenization.js";
import { sendEMAIL } from "../../utils/email.util.js";
import { createBusinessProfile, createCustomer, createUser, readAllCustomers, readAllUsers, readBusinessProfile, readCustomers, readUsers, updateBusinessProfile, updateCustomer } from "./auth.service.js";
import bcrypt from "bcrypt";
import handlebars from "handlebars";
import path from "path";
import fs from 'fs';
import { tendersAllList, tenders_all_field } from "../tenders/tenders.controller.js";
import { readAllTenders } from "../tenders/tenders.service.js";
import { createPlanHistory, readPlan } from "../plan/plan.service.js";
import { add, format } from "date-fns";
const __dirname = path.resolve();

const select_customer = { uuid: 1, customer_id: 1, full_name: 1, email: 1, username: 1, phone_no: 1, organization_name: 1, website_url: 1, country: 1, status: 1, last_logged_in: 1, plans: 1, tenders_filter: 1, address: 1 }

const select_all = {
    customer_id: 1,
    uuid: 1,
    full_name: 1,
    email: 1,
    username: 1,
    phone_no: 1,
    organization_name: 1,
    website_url: 1,
    country: 1,
    address: 1,
    city: 1,
    location: 1,
    pincode: 1,
    telephone_no: 1,
    products_services: 1,
    operation: 1,
    status: 1,
    last_logged_in: 1,
    plans: 1
}

export const getLoggedInCustomer = async (req, res, next) => {
    try {
        const { customer_id } = req.session;

        const customerCheck = await readCustomers({ customer_id }, select_all);
        if (!customerCheck) throw new Error("Customer not found");

        responseSend(res, 201, "Customer fetched successfully", customerCheck);

    } catch (error) {
        next(error);
    }
};

export const customerProfileUpdate = async (req, res, next) => {
    try {
        let customer_id = req.body.customer_id || req.session.customer_id;

        const customerCheck = await readCustomers({ customer_id }, select_customer);
        if (!customerCheck) throw new Error("Customer not found");

        let updateData = {
            ...customerCheck,
            ...req.body,
        }

        if (req.body.purchase_plan_id) {

            let start_date = new Date();
            let end_date = new Date(req.body.plan_expire_date);

            let plans = await readPlan({ plan_id: req.body.purchase_plan_id });
            updateData.plans = {
                plan_purchase_date: start_date,
                purchase_plan_id: req.body.purchase_plan_id,
                plan_expire_date: end_date,
                received_amount: req.body.received_amount,
                plan_name: plans?.title,
            }

            let historyPayload = {
                customer_id,
                plan_id: req.body.purchase_plan_id,
                plan_type: plans.plan_type,
                start_date,
                end_date,
                amount: req.body.received_amount,
            }

            await createPlanHistory(historyPayload);

            sendEMAIL(
                [
                    {
                        email_address: {
                            address: customerCheck.email,
                            name: customerCheck.full_name,
                        }
                    }
                ],
                "You are now an active plan user",
                "",
                `<p>Your plan ${plans?.title} has been activated today and will expire on ${format(end_date, "dd-MM-yyyy hh:mm:ss a")}.</p>`,
            );
        }

        delete updateData.purchase_plan_id;
        delete updateData.plan_expire_date;

        const update = await updateCustomer({ customer_id }, updateData, select_customer)

        responseSend(res, 201, "Customer updated successfully", update);

    } catch (error) {
        next(error);
    }
};

export const customerRegister = async (req, res, next) => {
    try {
        const { email, username, plan_id } = req.body;

        const customerUsernameCheck = await readCustomers({ username }, { customer_id: 1 });
        if (customerUsernameCheck) throw new Error("Customer with this username already Exists");

        let planFilter = {};
        let start_date = new Date();
        let end_date = new Date();
        end_date.setFullYear(end_date.getFullYear() + 30);

        if (plan_id) {
            planFilter._id = plan_id;
        } else {
            planFilter.plan_type = "Free";
        }

        const planData = await readPlan(planFilter);

        if (planData.validity_days) {
            end_date = add(new Date(), { days: parseInt(planData.validity_days) });
        }

        req.body.plans = {
            purchase_plan_id: planData._id,
            plan_purchase_date: start_date,
            plan_expire_date: end_date,
            plan_name: planData.plan_name
        }

        const pass = `${req.body.username}@Bids`;
        const hashPass = await bcrypt.hash(pass, 10);

        req.body.password = hashPass;

        const _customerData = await createCustomer(req.body);

        createPlanHistory({
            customer_id: _customerData.customer_id,
            plan_id: planData._id,
            plan_type: planData.plan_type,
            start_date: start_date,
            end_date: end_date,
            amount: planData.amount
        })

        let response = {
            customer_id: _customerData.customer_id,
            full_name: _customerData.full_name,
            email: _customerData.email,
            username: _customerData.username,
            phone_no: _customerData.phone_no,
            organization_name: _customerData.organization_name,
            website_url: _customerData.website_url,
            country: _customerData.country,
        }

        handlebars.registerHelper("inc", function (value, options) {
            return parseInt(value) + 1;
        });

        const filePath = path.join(__dirname, '/template/registrationMailFormat.hbs');
        const source = fs.readFileSync(filePath, 'utf-8').toString();
        const template = handlebars.compile(source);

        const htmlToSend = template({
            user_id: req.body.username,
            password: pass,
            validity: end_date
        });

        const mailTo = [];

        mailTo.push({
            email_address: {
                address: email,
                name: _customerData.full_name,
            }
        })
        console.log("SAdfdsssssssssssssssssss")
        console.log("SAdfdsssssssssssssssssss")
        sendEMAIL(
            mailTo,
            "You are now registered with us",
            "",
            htmlToSend
        );

        responseSend(res, 201, "You are now registered with us, our team will contact you and activate your account.", response);

    } catch (error) {
        next(error);
    }
};

export const updateCustomerPassword = async (req, res, next) => {
    try {
        const { old_password, new_password } = req.body;
        const { customer_id } = req.session;

        const customerCheck = await readCustomers({ customer_id }, { password: 1 });
        if (!customerCheck) throw new Error("Customer not found");

        const verifyPassword = await bcrypt.compare(old_password, customerCheck.password);
        if (!verifyPassword) throw new Error("Password is Incorrect");

        customerCheck.password = await bcrypt.hash(new_password, 10);

        await updateCustomer({ customer_id }, { ...customerCheck, last_password_reset: new Date() });

        responseSend(res, 201, "Your password changed successfully", {});

    } catch (error) {
        next(error);
    }
};

export const resetCustomerPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;

        const customerCheck = await readCustomers({ reset_password_link: token }, { customer_id: 1 });
        if (!customerCheck) throw new Error("Invalid link or link expired to change password");

        customerCheck.password = await bcrypt.hash(password, 10);

        await updateCustomer({ customer_id: customerCheck.customer_id }, { ...customerCheck, last_password_reset: new Date() });

        responseSend(res, 201, "Your password changed successfully", {});

    } catch (error) {
        next(error);
    }
};

export const customerLogin = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const customerData = await readCustomers({ username }, { ...select_customer, password: 1 });
        if (!customerData) throw new Error("Please enter correct username");

        if (customerData.status === customerStatus.INACTIVE || !customerData.password)
            throw new Error("Please wait or contact our team to active your account.");

        if (customerData.status === customerStatus.BLOCKED)
            throw new Error("Please contact our team to unblock your account.");


        const verifyPassword = await bcrypt.compare(password, customerData.password);
        if (!verifyPassword) throw new Error("Password is Incorrect");

        await updateCustomer({ username }, { last_logged_in: new Date() });

        let responseData = {
            _id: customerData._id,
            full_name: customerData.full_name,
            email: customerData.email,
            username: customerData.username,
            customer_id: customerData.customer_id,
            last_logged_in: customerData.last_logged_in,
            plans: customerData.plans,
        }

        const tokens = await generateSession(responseData);
        let response = {
            ...responseData,
            access_token: tokens
        }
        responseSend(res, 201, "Customer Logged-In Successfully", response);
    } catch (error) {
        next(error);
    }
};

export const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const userData = await readUsers({ email });
        if (!userData) throw new Error("Please check email");

        const verifyPassword = bcrypt.compare(password, userData.password);
        if (!verifyPassword) throw new Error("Password is Incorrect");

        const tokens = await generateSession(userData);
        userData.password = undefined;

        responseSend(res, 201, "User Logged-In Successfully", {
            roles: userData.role,
            tokens
        });
    } catch (error) {
        next(error);
    }
};

export const customerForgotPassword = async (req, res, next) => {
    try {
        const { username } = req.body;

        const customer = await readCustomers({ username }, { email: 1, reset_password_link: 1 });
        if (!customer) {
            throw new Error("Could not find this email in our records");
        }

        const token = await generateSession({ _id: customer._id }, {
            expiresIn: "900000",
        });

        await updateCustomer(
            { _id: customer._id },
            { reset_password_link: String(token) },
        );

        const filePath = path.join(__dirname, '/template/forgetPasswordMailFormat.hbs');
        const source = fs.readFileSync(filePath, 'utf-8').toString();
        const template = handlebars.compile(source);

        const htmlToSend = template({
            token: token
        });

        await sendEMAIL(
            [{
                email_address: {
                    address: customer.email,
                    name: customer.name,
                },
            }],
            "Request to reset your password",
            "",
            htmlToSend
        );

        responseSend(
            res,
            200,
            "Please check your email. We have sent a link to reset your password",
        );
    } catch (error) {
        next(error);
    }
};

export const customersList = async (req, res, next) => {
    try {
        const { keywords, pageNo = 0, limit = '10', sortBy = '-1', sortField = 'createdAt' } = req.query;

        let filter = {};

        if (keywords && keywords !== "")
            filter = {
                ...filter,
                $or: [
                    { full_name: { $regex: keywords, $options: 'i' } },
                    { email: { $regex: keywords, $options: 'i' } },
                    { phone_no: { $regex: keywords, $options: 'i' } },
                    { organization_name: { $regex: keywords, $options: 'i' } },
                    { website_url: { $regex: keywords, $options: 'i' } },
                ]
            };

        let result = await readAllCustomers(
            filter,
            { updatedAt: 0 },
            { [sortField]: parseInt(sortBy) },
            parseInt(pageNo) * parseInt(limit),
            parseInt(limit),
        )

        responseSend(res, 201, "Customers records", { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
};


export const customersStatusUpdate = async (req, res, next) => {
    try {
        const { customer_id, status } = req.body;

        const customerCheck = await readCustomers({ customer_id }, { full_name: 1, email: 1, username: 1, password: 1 });
        if (!customerCheck) throw new Error("Customer not found");

        let updatePayload = {
            status
        }

        await updateCustomer({ customer_id }, updatePayload, select_customer);

        responseSend(res, 201, `Customer ${req.body.status === 'active' ? "activated" : "deactivated"} successfully`, {});

    } catch (error) {
        next(error);
    }
};

export const sendDataMail = async (tendersData = [], customer_id, full_name, email, regionsDataArray, pendingDays) => {
    try {
        handlebars.registerHelper("inc", function (value, options) {
            return parseInt(value) + 1;
        });

        let date = new Date();
        date.setDate(date.getDate() - 1);
        const formattedDatee = format(date, "EEEE, LLLL dd, yyyy");
        const filePath = path.join(__dirname, '/template/tenderMailFormat.hbs');
        const source = fs.readFileSync(filePath, 'utf-8').toString();
        const template = handlebars.compile(source);

        const htmlToSend = template({
            rows: tendersData,
            regions: regionsDataArray,
            pendingDays,
            formattedDatee
        });

        const mailTo = [];

        mailTo.push({
            email_address: {
                address: email,
                name: full_name,
            }
        })

        let mailRes = await sendEMAIL(
            mailTo,
            mailSubject.tendersToCustomer + "for " + formattedDatee,
            "",
            htmlToSend
        )

        console.log(mailRes, "mailRes");

    } catch (error) {
        console.log(error, "error");
        throw new Error(error);
    }
};

export const assignTendersToCustomer = async (req, res, next) => {
    try {
        const { filter, customer_id, tenders_id } = req.body;

        let customerData = await readCustomers({ customer_id }, { tenders_filter: 1, tenders_id: 1 });

        customerData.tenders_filter = filter;
        customerData.tenders_id = tenders_id;

        await updateCustomer({ customer_id }, customerData);

        responseSend(res, 201, "Tenders filter activated successfully", null);
    } catch (error) {
        next(error);
    }
};

export const getLoggedInBusinessProfile = async (req, res, next) => {
    try {
        const { customer_id } = req.session;

        const profileCheck = await readBusinessProfile({ customer_id });

        responseSend(res, 201, "Profile fetched successfully", profileCheck || {});

    } catch (error) {
        next(error);
    }
};

export const businessProfileUpdate = async (req, res, next) => {
    try {
        const { customer_id } = req.session;

        let profileData = await readBusinessProfile({ customer_id });
        if (!profileData) {
            req.body.customer_id = customer_id;
            profileData = await createBusinessProfile(req.body);
        } else {
            profileData = await updateBusinessProfile({ customer_id }, req.body)
        }

        responseSend(res, 201, "Profile updated successfully", profileData);

    } catch (error) {
        next(error);
    }
};


export const usersList = async (req, res, next) => {
    try {
        const { keywords, pageNo, limit, sortBy, sortField } = req.query;

        let filter = {};

        if (keywords && keywords !== "")
            filter = {
                ...filter,
                $or: [
                    { username: { $regex: keywords, $options: 'i' } },
                ]
            };

        let result = await readAllUsers(
            filter,
            { username: 1, email: 1, role: 1, last_logged_in: 1 },
            { [sortField]: parseInt(sortBy) },
            parseInt(pageNo) * parseInt(limit),
            parseInt(limit),
        )

        responseSend(res, 201, "Users records", { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
};


export const usersAdd = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userEmailCheck = await readUsers({ email }, { username: 1 });
        if (userEmailCheck) throw new Error("User with this email already Exists");

        req.body.username = GenerateUserName(email);

        const hashPass = await bcrypt.hash(password, 10);

        req.body.password = hashPass;

        const userData = await createUser(req.body);

        responseSend(res, 201, "User registered successfully.", userData);
    } catch (error) {
        next(error);
    }
};