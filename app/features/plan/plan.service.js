import { ADMIN_EMAIL } from "../../helpers/constance.js";
import planModel from "../../models/plan.model.js";
import planHistoryModel from "../../models/plan_history.js";
import planRequestModel from "../../models/plan_request.js";
import { sendEMAIL } from "../../utils/email.util.js";


export const readPlans = async (filter, select = {}) => {
    try {
        const result = await planModel.find(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const readPlan = async (filter, select = {}) => {
    try {
        const result = await planModel.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const createPlanHistory = async (insertData) => {
    try {
        const result = new planHistoryModel(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
}
export const sendSubscriptionInfoToAdmin = async (userName, userEmail, subscriptionType) => {
    try {
        const adminEmail = ADMIN_EMAIL;
        const subject = "New Subscription Request - Bidsinfoglobal";
        const textContent = "";
        const htmlContent = `
                                <p>A new subscription request has been received.</p>
                                <p><strong>User Details:</strong></p>
                                <ul>
                                    <li><strong>Name:</strong> ${userName}</li>
                                    <li><strong>Email:</strong> ${userEmail}</li>
                                    <li><strong>Subscription Type:</strong> ${subscriptionType}</li>
                                </ul>
                                <p>Please review and process the request at your earliest convenience.</p>
                            `;
        const mailRes = await sendEMAIL(
            adminEmail,
            subject,
            textContent,
            htmlContent,
            []
        );
        console.log(mailRes)

        if (mailRes.message === "OK") {
            console.log("Subscription request email sent successfully to admin.");
        } else {
            console.error("Failed to send subscription request email to admin.", mailRes.message);
        }
    } catch (error) {
        console.log("sdfdsfds")
        // throw new Error(error);
    }
}

export const createPlanRequest = async (insertData) => {
    try {
        const result = new planRequestModel(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
}

export const readPlanRequest = async (filter, select = {}) => {
    try {
        const result = await planRequestModel.find(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const readPlanRequestSingle = async (filter, select = {}) => {
    try {
        const result = await planRequestModel.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}
export const updatePlanRequest = async (filter, updateData, select = {}) => {
    try {
        const result = await planRequestModel
            .findOneAndUpdate(filter, updateData, { new: true, runValidators: true })
            .lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};