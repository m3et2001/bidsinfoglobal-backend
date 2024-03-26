import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const businessProfileSchema = new mongoose.Schema(
    {
        customer_id: {
            type: String
        },
        company_name: {
            type: String
        },
        contacts: {
            type: String
        },
        telephone_no: {
            type: String
        },
        official_email: {
            type: String
        },
        fax: {
            type: String
        },
        address: {
            type: String
        },
        city: {
            type: String
        },
        location: {
            type: String
        },
        pincode: {
            type: String
        },
        country: {
            type: String
        },
        website_url: {
            type: String
        },
        employee_strength: {
            type: String
        },
        industry_type: {
            type: Array
        },
        business_area: {
            type: String
        },
        establishment_details: {
            type: String
        },
    },
    {
        timestamps: true
    }
);

const businessProfileModel = mongoose.model("BusinessProfile", businessProfileSchema);

export default businessProfileModel;