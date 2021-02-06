import mongoose from "mongoose";

export const group = new mongoose.Schema(
    {
        name: {
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
        icon: {
            type: String,
            default: "/images/group.png",
        },
        owner: {
            type: String,
            required: true,
        },
        managers: {
            type: Array,
            default: [],
        },
        events: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const model = mongoose.models.groups || mongoose.model("groups", group);

export default model;
