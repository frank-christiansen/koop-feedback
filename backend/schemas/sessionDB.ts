"use server";
import { model, models, Schema } from "mongoose";

export const sessionDB = models.session || model(
    "session",
    new Schema({
        Users: { type: [String], required: true },
        SessionId: { type: String, required: true },
        Code: { type: Number, required: true },
        Host: { type: String, required: true },
        CreatedAt: { type: Date, default: Date.now },
        IsStarted: { type: Boolean, default: false },
        IsFinished: { type: Boolean, default: false },
        DoneUsers: { type: [String], default: [] },
    })
)  