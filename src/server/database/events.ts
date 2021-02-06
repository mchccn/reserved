import mongoose from "mongoose";

export const event = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: "",
        },
        group: {
            type: String,
            required: true,
        },
        minDuration: {
            type: Number,
            default: 0,
        },
        maxDuration: {
            type: Number,
            default: 1440,
        },
        minDate: {
            type: Date,
            default() {
                return new Date();
            },
        },
        maxDate: {
            type: Date,
            default() {
                const dt = new Date();
                return new Date(dt.setFullYear(dt.getFullYear() + 1000));
            },
        },
        scheduled: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const model = mongoose.models.events || mongoose.model("events", event);

export default model;
