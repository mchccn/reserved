import mongoose from "mongoose";
import { scheduled } from "./scheduled";

export const event = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    minDuration: {
        type: Number,
        default: 0,
    },
    maxDuration: {
        type: Number,
        default: Infinity,
    },
    minDate: {
        type: Date,
        required: true,
    },
    maxDate: {
        type: Date,
        required: true,
    },
    scheduled: {
        type: [scheduled],
        default: [],
    },
},
{
    timestamps: true,
});

const model = mongoose.models.events || mongoose.model("events", event);

export default model;
