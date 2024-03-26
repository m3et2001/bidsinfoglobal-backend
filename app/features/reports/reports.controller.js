"use strict";

import { responseSend } from "../../helpers/responseSend.js";
import { json2csv } from 'json-2-csv';
import { readAllCustomers } from "../auth/auth.service.js";
import fs from "fs";
import { BASE_URL } from "../../helpers/constance.js";
import { createReports, readAllReports } from "./reports.service.js";

const select_customer = {
    customer_id: 1,
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

const selectReports = {
    from_date: 1,
    to_date: 1,
    download_url: 1,
    type: 1,
    status: 1,
    createdAt: 1
}

export const getCustomerReports = async (req, res, next) => {
    try {
        const { pageNo, limit, sortBy, sortField = "createdAt", type = "Customer" } = req.query;
        let filter = { type: type };

        let result = await readAllReports(
            filter,
            selectReports,
            { [sortField]: parseInt(sortBy) },
            parseInt(pageNo) * parseInt(limit),
            parseInt(limit),
        )

        responseSend(res, 201, "Reports records", { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
}

export const generateCustomerReports = async (req, res, next) => {
    try {
        const { from_date = null, to_date = null } = req.body;

        let filter = { status: "active" };

        // if (from_date && to_date) {
        //     filter.created_at = {
        //         $gte: new Date(from_date),
        //         $lte: new Date(to_date),
        //     }
        // }


        let customerData = await readAllCustomers(
            filter,
            select_customer,
            { createdAt: 1 },
            0,
            5000,
        )

        customerData = customerData?.result?.map(function (row) {
            return {
                full_name: row.full_name,
                email: row.email,
                username: row.username,
                phone_no: row.phone_no,
                organization_name: row.organization_name,
                website_url: row.website_url,
                country: row.country,
                status: row.status,
                customer_id: row.customer_id,
                last_logged_in: row.last_logged_in,
                plan_name: row?.plans?.plan_name,
                plan_expire_date: row?.plans?.plan_expire_date,
                plan_purchase_date: row?.plans?.plan_purchase_date,
                purchase_plan_id: row?.plans?.purchase_plan_id
            }
        });

        console.log(customerData, "customerData");

        let result = await json2csv(customerData);

        let filename = new Date().getTime();

        async function fileGenerateCallback(err) {
            let payload = {
                from_date,
                to_date,
                download_url: BASE_URL + `public/reports/${filename}.csv`,
                type: "Customer"
            }
            if (err) {
                payload.status = err?.message || "Some error occurred";
            } else {
                payload.status = "Success";
            }

            await createReports(payload);

            responseSend(res, 201, "Reports generated successfully", {});
        }

        if (!fs.existsSync('public/reports')) {
            fs.mkdirSync('public/reports')
        }

        fs.writeFile(`public/reports/${filename}.csv`, result, 'utf8', fileGenerateCallback);


    } catch (error) {
        next(error);
    }
};