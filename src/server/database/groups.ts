import mongoose from "mongoose";
import { event } from "./events";

export const group = new mongoose.Schema({
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
        type: [event],
        default: [],
    },
},
{
    timestamps: true,
});

const model = mongoose.models.groups || mongoose.model("groups", group);

export default model;
