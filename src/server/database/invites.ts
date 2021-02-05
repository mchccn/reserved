import mongoose from "mongoose";

const invite = new mongoose.Schema(
    {
        group: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        inviter: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const model = mongoose.models.invites || mongoose.model("invites", invite);

export default model;
