import mongoose from "mongoose";

const statesSchema = new mongoose.Schema(
    {
        country_name: {
            type: String,
            default: "India"
        },
        name: {
            type: String
        },
        code: {
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

const statesModel = mongoose.model("states", statesSchema);

export default statesModel;