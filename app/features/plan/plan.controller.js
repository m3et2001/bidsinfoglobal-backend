"use strict";

import { add, format } from "date-fns";
import { subscribePlanReq } from "../../helpers/constance.js";
import { responseSend } from "../../helpers/responseSend.js";
import { readCustomers, updateCustomer } from "../auth/auth.service.js";
import { sendEMAIL } from "../../utils/email.util.js";
import { createPlanHistory, createPlanRequest, readPlan, readPlanRequest, readPlanRequestSingle, readPlans, sendSubscriptionInfoToAdmin, updatePlanRequest } from "./plan.service.js";

const select = { plan_id: 1, title: 1, plan_name: 1, amount: 1, plan_type: 1, validity_days: 1, access: 1, status: 1 };

export const getPlansList = async (req, res, next) => {
    try {
        const planList = await readPlans({ status: 1, plan_type: "Paid" });
        if (!planList) throw new Error("Plans not found");

        responseSend(res, 201, "Plans fetched successfully", planList);

    } catch (error) {
        next(error);
    }
};

export const subscribePlan = async (req, res, next) => {
    try {
        const { plan_id, categories,formData} = req.body;
        const { customer_id } = req.session;

        const custCheck = await readCustomers({ customer_id, status: "active" }, { email: 1, full_name: 1 });
        if (!custCheck) throw new Error("Customer not found");
        
        const planData = await readPlan({ plan_id }, select);
        if (!planData) throw new Error("Plan not found");

        const validRequest = await readPlanRequest({ plan_id, customer_id, status: subscribePlanReq.REQUESTED }, { _id: 1 });
        if (validRequest.length > 0) responseSend(res, 201, "Your request has been submitted, please wait while our team contacts you.");

        let payload = {
            customer_id,
            plan_id,
            categories,
            formData,
            request_date: new Date(),
        }
        await createPlanRequest(payload);
        sendSubscriptionInfoToAdmin(custCheck?.full_name, custCheck?.email,planData?.title)

        responseSend(res, 201, "Your request has been submitted, please wait while our team contacts you.", {});

    } catch (error) {
        next(error);
    }
};

export const subscribePlanToCustomer = async (req, res, next) => {
    try {
        const { plan_request_id } = req.body;

        const planRequest = await readPlanRequestSingle({ _id: plan_request_id, status: subscribePlanReq.REQUESTED });
        if (!planRequest) throw new Error("Plan request already activated or not fouhnd");

        const custCheck = await readCustomers({ customer_id: planRequest.customer_id, status: "active" }, { email: 1, full_name: 1 });
        if (!custCheck) throw new Error("Customer not found");

        const planData = await readPlan({ plan_id: planRequest.plan_id }, select);
        if (!planData) throw new Error("Plan not found");

        let start_date = new Date();
        let end_date = add(new Date(), { days: parseInt(planData.validity_days) });

        let historyPayload = {
            customer_id: planRequest.customer_id,
            plan_id: planRequest.plan_id,
            plan_type: planData.plan_type,
            start_date,
            end_date,
            amount: planData.amount,
        }

        await createPlanHistory(historyPayload);

        planRequest.status = subscribePlanReq.PROCESSED;

        await updatePlanRequest({ _id: plan_request_id }, planRequest);

        let customerUpdatePayload = {
            plan_purchase_date: start_date,
            plan_expire_date: end_date,
            purchase_plan_id: planRequest.plan_id,
            plan_name: planData.title,
            categories: planRequest.categories,
            received_amount: 0,
        }

        await updateCustomer({ customer_id: planRequest.customer_id }, { plans: customerUpdatePayload }, {});

        if (planData.plan_name !== "CUSTOMISE_PACKAGE") {
            sendEMAIL(
                [
                    {
                        email_address: {
                            address: custCheck.email,
                            name: custCheck.full_name,
                        }
                    }
                ],
                "You are now an active plan user",
                "",
                `<p>Your plan ${planData.title} has been activated today and will expire on ${format(end_date, "dd-MM-yyyy hh:mm:ss a")}.</p>`,
            );

        }

        responseSend(res, 201, "Plan activated successfully for the customer. Please set expiry date and other setting in customer section.", {});

    } catch (error) {
        next(error);
    }
};

export const getPlanRequestList = async (req, res, next) => {
    try {
        const planRequests = await readPlanRequest({});

        for (let index = 0; index < planRequests.length; index++) {
            const element = planRequests[index];

            const planData = await readPlan({ plan_id: element.plan_id }, { plan_name: 1, plan_id: 1, plan_type: 1, title: 1, validity_days: 1 });
            const customerData = await readCustomers({ customer_id: element.customer_id }, { customer_id: 1, full_name: 1, email: 1, phone_no: 1 })

            element.planData = planData;
            element.customerData = customerData;
        }

        responseSend(res, 201, "Plans requests fetched successfully", planRequests);

    } catch (error) {
        next(error);
    }
};