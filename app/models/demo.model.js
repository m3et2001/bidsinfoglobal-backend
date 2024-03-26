import mongoose from "mongoose";

const demoRequestSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        email: {
            type: String
        },
        phoneno: {
            type: String
        },
        organization: {
            type: String
        },
        website: {
            type: String
        },
        country: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

const demoRequestModel = mongoose.model("demo_request", demoRequestSchema);

export default demoRequestModel;