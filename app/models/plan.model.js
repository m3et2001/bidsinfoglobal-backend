import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
    {
        plan_id: {
            type: String
        },
        title: {
            type: String
        },
        plan_name: {
            type: String
        },
        plan_type: {
            type: String,
            default: "Free"
        },
        validity_days: {
            type: String
        },
        access: {
            type: String
        },
        amount: {
            type: String
        },
        status: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const planModel = mongoose.model("Plan", planSchema);

export default planModel;