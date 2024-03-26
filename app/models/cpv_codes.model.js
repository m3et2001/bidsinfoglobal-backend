import mongoose from "mongoose";

const cpvCodesSchema = new mongoose.Schema(
    {
        code: {
            type: String
        },
        description: {
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

const cpvCodesModel = mongoose.model("cpvcodes", cpvCodesSchema);

export default cpvCodesModel;