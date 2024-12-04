import mongoose from "mongoose";

const regionsSchema = new mongoose.Schema(
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
        project_title: {
            type: String
        },
        project_description: {
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

const regionsModel = mongoose.model("regions", regionsSchema);

export default regionsModel;