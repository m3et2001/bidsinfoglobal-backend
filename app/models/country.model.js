import mongoose from "mongoose";

const countrySchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        title: {
            type: String
        },
        description: {
            type: String
        },
        num_code: {
            type: String
        },
        str_code: {
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

const countryModel = mongoose.model("countries", countrySchema);

export default countryModel;