import mongoose from "mongoose";

const reportsSchema = new mongoose.Schema(
    {
        from_date: {
            type: String
        },
        to_date: {
            type: String
        },
        download_url: {
            type: String
        },
        type: {
            type: String,
            default: "Customer"
        },
        status: {
            type: String
        },
    },
    {
        timestamps: true
    }
);

const customerModel = mongoose.model("Reports", reportsSchema);

export default customerModel;