import mongoose from "mongoose";

const fundingAgencySchema = new mongoose.Schema(
    {
        title: {
            type: String
        },
        is_deleted: {
            type: Boolean,
            default: false
        },
        is_active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const fundingAgencyModel = mongoose.model("funding_agency", fundingAgencySchema);

export default fundingAgencyModel;