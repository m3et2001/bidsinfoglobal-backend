import mongoose from "mongoose";
import { zeroPad } from "../helpers/common.js";

const grantsSchema = new mongoose.Schema(
    {
        grants_id: {
            type: String
        },
        title: {
            type: String
        },
        sub_region: {
            type: String
        },
        donor: {
            type: String
        },
        contact_information: {
            type: String
        },
        location: {
            type: String
        },
        big_ref_no: {
            type: String
        },
        title: {
            type: String
        },
        type: {
            type: String
        },
        status: {
            type: String
        },
        value: {
            type: String
        },
        type_of_services: {
            type: String
        },
        sectors: {
            type: String
        },
        regions: {
            type: String
        },
        cpv_codes: {
            type: String
        },
        funding_agency: {
            type: String
        },
        deadline: {
            type: String
        },
        duration: {
            type: String
        },
        attachment: {
            type: String
        },
        post_date: {
            type: Date
        },
        is_active: {
            type: Boolean,
            default: true
        },
        is_deleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

grantsSchema.pre("save", async function (next) {
    const data = this;
    data.grants_id = data._id;

    const lastGrant = await grantsModel.findOne(null, null, { sort: { ["createdAt"]: -1 } }).select({ big_ref_no: 1 });
    let split = lastGrant.big_ref_no.split("G-");

    data.big_ref_no = "G-" + zeroPad(parseInt(split[1]) + 1, 6);

    next();
});

const grantsModel = mongoose.model("grants", grantsSchema);

export default grantsModel;