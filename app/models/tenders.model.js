import mongoose from "mongoose";
import { zeroPad } from "../helpers/common.js";

const tendersSchema = new mongoose.Schema(
    {
        tenders_id: {
            type: String
        },
        authority_name: {
            type: String
        },
        address: {
            type: String
        },
        telephone: {
            type: String
        },
        fax_number: {
            type: String
        },
        email: {
            type: String
        },
        contact_person: {
            type: String
        },
        big_ref_no: {
            type: String,
            unique: true
        },
        description: {
            type: String
        },
        tender_type: {
            type: String
        },
        tender_no: {
            type: String
        },
        funding_agency: {
            type: String
        },
        tender_competition: {
            type: String
        },
        published_date: {
            type: Date
        },
        closing_date: {
            type: String
        },
        country: {
            type: String
        },
        emd: {
            type: String
        },
        estimated_cost: {
            type: String
        },
        documents: {
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

tendersSchema.pre("save", async function (next) {
    const model = this;
    model.tenders_id = model._id;

    const lastTender = await tendersModel.findOne(null, null, { sort: { ["createdAt"]: -1 } }).select({ big_ref_no: 1 });
    let split = lastTender.big_ref_no.split("T-");
    model.big_ref_no = "T-"+zeroPad(parseInt(split[1]) + 1, 6);

    next();
})

const tendersModel = mongoose.model("tenders", tendersSchema);

export default tendersModel;