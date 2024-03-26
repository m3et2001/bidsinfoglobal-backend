import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const homePageSchema = new mongoose.Schema(
    {
        category_title: { type: String },
        category_description: { type: String },
        category_data: { type: Array },
        tender_title: { type: String },
        tender_description: { type: String },
        global_tender_data: { type: Array },
        indian_tender_data: { type: Array }
    },
    {
        _id: false,
        timestamps: true,
    }
);

const aboutUsSchema = new mongoose.Schema(
    {
        title_one: {
            type: String
        },
        sub_title_one: {
            type: String
        },
        image_one: {
            type: String
        },
        description_title_one: {
            type: String
        },
        description_one: {
            type: String
        },
        description_one: {
            type: String
        },
        title_two: {
            type: String
        },
        sub_title_two: {
            type: String
        },
        image_two: {
            type: String
        },
        list_description: {
            type: Array
        }
    },
    {
        _id: false,
        timestamps: true
    }
);

const eprocurmentSchema = new mongoose.Schema(
    {
        icon: { type: String },
        label: { type: String }
    },
    {
        timestamps: true,
    }
);

const contactUsSchema = new mongoose.Schema(
    {
        contact_title: { type: String },
        contact_description: { type: String },
        phone: { type: String },
        email: { type: String },
        address: { type: String },
        google_map_url: { type: String }
    },
    {
        _id: false,
        timestamps: true,
    }
);

const serviceSchema = new mongoose.Schema(
    {
        image: { type: String },
        title: { type: String },
        description: { type: String }
    },
    {
        timestamps: true,
    }
);

const cmsSchema = new mongoose.Schema(
    {
        uid: {
            type: String,
            unique: true
        },
        auth_record: {
            forget_password: { type: String },
            login_title: { type: String },
            login_description: { type: String },
            register_title: { type: String },
            register_description: { type: String },
        },
        home_page: homePageSchema,
        about_us_page: aboutUsSchema,
        contact_details: contactUsSchema,
        social_links: {
            title: { type: String },
            description: { type: String },
            twitter: { type: String },
            facebook: { type: String },
            instagram: { type: String },
            skype: { type: String },
            linkedin: { type: String },
            whatsapp: { type: String }
        },
        eprocurment_page: {
            title: { type: String },
            description: { type: String },
            drop_demo_title: { type: String },
            drop_demo_description: { type: String }
        },
        eprocurment_records: [eprocurmentSchema],
        service_page: {
            title: { type: String },
            description: { type: String }
        },
        service_records: [serviceSchema],
        grants_info: {
            title: { type: String },
            description: { type: String }
        },
        tenders_info: {
            title: { type: String },
            description: { type: String }
        },
        project_info: {
            title: { type: String },
            description: { type: String }
        },
        contract_award_info: {
            title: { type: String },
            description: { type: String }
        },
        is_active: { type: Boolean }
    },
    {
        timestamps: true
    }
);

cmsSchema.pre("save", async function (next) {
    const data = this;
    data.uid = data._id;

    next();
});

const cmsModel = mongoose.model("cms", cmsSchema);

export default cmsModel;