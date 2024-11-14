import mongoose from "mongoose";

const projectsSchema = new mongoose.Schema(
    {
        project_id: {
            type: String
        },
        title: {
            type: String
        },
        sub_region: {
            type: String
        },
        big_ref_no: {
            type: String,
            unique: true
        },
        project_name: {
            type: String
        },
        project_background: {
            type: String
        },
        project_location: {
            type: String
        },
        project_status: {
            type: String
        },
        project_publishing_date: {
            type: String
        },
        estimated_project_completion_date: {
            type: String
        },
        client_name: {
            type: String
        },
        client_address: {
            type: String
        },
        funding_agency: {
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

projectsSchema.pre("save", async function (next) {
    const data = this;
    data.project_id = data._id;

    const lastGrant = await projectsModel.findOne(null, null, { sort: { ["createdAt"]: -1 } }).select({ big_ref_no: 1 });
    // let split = lastGrant.big_ref_no.split("P-");

    // data.big_ref_no = "P-" + zeroPad(parseInt(split[1]) + 1, 6);

    next();
});

const projectsModel = mongoose.model("projects", projectsSchema);

export default projectsModel;