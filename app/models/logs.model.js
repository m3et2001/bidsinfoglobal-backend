import mongoose from "mongoose";

const logsSchema = new mongoose.Schema(
    {
        title: {
            type: String
        },
        description: {
            type: String
        },
        changed_values_payload: {
            type: Object
        },
        user: {
            type: Object
        }
    },
    {
        timestamps: true
    }
);

const logsModel = mongoose.model("logs", logsSchema);

export default logsModel;