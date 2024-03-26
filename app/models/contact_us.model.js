import mongoose from "mongoose";

const contactUsSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        email: {
            type: String
        },
        subject: {
            type: String
        },
        message: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

const contactUsModel = mongoose.model("contat_us_record", contactUsSchema);

export default contactUsModel;