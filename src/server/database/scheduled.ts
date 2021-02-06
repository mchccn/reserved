import mongoose from "mongoose";

export const scheduled = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        group: {
            type: String,
            required: true,
        },
        event: {
            type: String,
            required: true,
        },
        from: {
            type: Date,
            required: true,
        },
        to: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const model = mongoose.models.scheduled || mongoose.model("scheduled", scheduled);

export default model;
