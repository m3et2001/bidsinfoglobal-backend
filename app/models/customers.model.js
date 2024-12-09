import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { userRoles } from "../helpers/constance.js";

const planSchema = new mongoose.Schema(
    {
        purchase_plan_id: { type: String },
        received_amount: { type: String },
        plan_name: { type: String },
        categories: { type: Array },
        plan_purchase_date: { type: Date },
        plan_expire_date: { type: Date },
    },
    {
        _id: false,
        timestamps: true,
    }
);

const customersSchema = new mongoose.Schema(
    {
        customer_id: {
            type: String,
            unique: true
        },
        customer_type: {
            type: String
        },
        uuid: {
            type: Number,
            unique: true
        },
        full_name: {
            type: String
        },
        email: {
            type: String
        },
        username: {
            type: String
        },
        password: {
            type: String
        },
        phone_no: {
            type: String
        },
        organization_name: {
            type: String
        },
        website_url: {
            type: String
        },
        country: {
            type: String
        },
        address: {
            type: String
        },
        city: {
            type: String
        },
        location: {
            type: String
        },
        pincode: {
            type: String
        },
        telephone_no: {
            type: String
        },
        products_services: {
            type: String
        },
        operation: {
            type: String
        },
        last_logged_in: {
            type: Date
        },
        reset_password_link: {
            type: String
        },
        last_password_reset: {
            type: Date
        },
        plans: planSchema,
        status: {
            type: String,
            default: "inactive"
        },
        role: {
            type: String,
            default: userRoles.CUSTOMERS
        },
        tenders_filter: {
            type: Object
        },
        tenders_id: {
            type: Object
        },
        grants_filter: {
            type: Object
        },
        grants_id: {
            type: Object
        },
        projects_filter: {
            type: Object
        },
        projects_id: {
            type: Object
        },
        contract_awards_filter: {
            type: Object
        },
        contract_awards_id: {
            type: Object
        },
        query_type: {
            type: String
        },
        raw_query: {
            type: String
        },
    },
    {
        timestamps: true
    }
);

customersSchema.pre("save", async function (next) {
    const customer = this;
    const row = await customModel.findOne({}, { uuid: 1 }, { sort: { createdAt: -1 } });

    if (row?.uuid) {
        customer.uuid = row?.uuid + 1;
    } else {
        customer.uuid = 5000
    }

    customer.customer_id = customer._id;

    next();
})

const customModel = mongoose.model("Customers", customersSchema);

export default customModel;