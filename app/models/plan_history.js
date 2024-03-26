import mongoose from "mongoose";

const planHistorySchema = new mongoose.Schema(
    {
        customer_id: {
            type: String
        },
        plan_id: {
            type: String
        },
        plan_type: {
            type: String
        },
        start_date: {
            type: String
        },
        end_date: {
            type: String
        },
        amount: {
            type: String,
        },
    },
    {
        timestamps: true
    }
);

planHistorySchema.pre("save", async function (next) {
    const data = this;
    data.plan_id = data._id;

    next();
});

const planHistoryModel = mongoose.model("PlanHistory", planHistorySchema);

export default planHistoryModel;