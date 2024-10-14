import mongoose from "mongoose";

const sectorsSchema = new mongoose.Schema(
    {
        sectors_id: {
            type: String
        },
        name: {
            type: String
        },
        title: {
            type: String
        },
        description: {
            type: String
        },
        icon: {
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

const sectorsModel = mongoose.model("sectors", sectorsSchema);

export default sectorsModel;