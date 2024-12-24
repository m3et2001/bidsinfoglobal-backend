import mongoose from "mongoose";
import { subscribePlanReq } from "../helpers/constance.js";


const planRequestSchema = new mongoose.Schema(
    {
        customer_id: {
            type: String
        },
        plan_id: {
            type: String
        },
        categories: {
            type: Array
        },
        formData: {
            type: Object
        },
        request_date: {
            type: Date
        },
        status: {
            type: String,
            default: subscribePlanReq.REQUESTED
        },
    },
    {
        timestamps: true
    }
);

const planRequestModel = mongoose.model("PlanRequest", planRequestSchema);

export default planRequestModel;