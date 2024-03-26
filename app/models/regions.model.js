import mongoose from "mongoose";

const regionsSchema = new mongoose.Schema(
    {
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

const regionsModel = mongoose.model("regions", regionsSchema);

export default regionsModel;