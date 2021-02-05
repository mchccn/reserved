import mongoose from "mongoose";

export const user = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: "",
        },
        website: {
            type: String,
            default: "",
        },
        snapchat: {
            type: String,
            default: "",
        },
        instagram: {
            type: String,
            default: "",
        },
        facebook: {
            type: String,
            default: "",
        },
        twitter: {
            type: String,
            default: "",
        },
        linkedin: {
            type: String,
            default: "",
        },
        groups: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const model = mongoose.models.users || mongoose.model("users", user);

export default model;
