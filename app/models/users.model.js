import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { userRoles } from "../helpers/constance.js";

const usersSchema = new mongoose.Schema(
    {
        uuid: {
            type: String,
            unique: true
        },
        username: {
            type: String
        },
        email: {
            type: String
        },
        role: {
            type: String,
            default: userRoles.SALES
        },
        password: {
            type: String
        },
        last_logged_in: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

usersSchema.pre("save", async function (next) {
    const user = this;
    user.uuid = user._id;
    user.password = await bcrypt.hash(user.password, 10);

    next();
})

const userModel = mongoose.model("Users", usersSchema);

export default userModel;