import mongoose from "mongoose";
import { zeroPad } from "../helpers/common.js";

const contractAwardSchema = new mongoose.Schema(
    {
        contract_award_id: {
            type: String
        },
        title: {
            type: String
        },
        sub_region: {
            type: String
        },
        org_name: {
            type: String
        },
        org_address: {
            type: String
        },
        telephone_no: {
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
            type: String
        },
        document_no: {
            type: String
        },
        bidding_type: {
            type: String
        },
        project_location: {
            type: String
        },
        contractor_details: {
            type: String
        },
        tender_notice_no: {
            type: String
        },
        description: {
            type: String
        },
        cpv_codes: {
            type: String
        },
        sectors: {
            type: String
        },
        regions: {
            type: String
        },
        funding_agency: {
            type: String
        },
        awards_publish_date: {
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

contractAwardSchema.pre("save", async function (next) {
    const data = this;
    data.contract_award_id = data._id;

    const lastAward = await contractAwardModel.findOne(null, null, { sort: { ["createdAt"]: -1 } }).select({ big_ref_no: 1 });
    let split = lastAward.big_ref_no.split("CA-");
    data.big_ref_no = "CA-" + zeroPad(parseInt(split[1]) + 1, 6);

    next();
});

const contractAwardModel = mongoose.model("contract_award", contractAwardSchema);

export default contractAwardModel;