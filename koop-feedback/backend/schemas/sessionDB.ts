"use server";
import { model, Schema } from "mongoose";

export const sessionDB = model(
    "session",
    new Schema({
        Users: { type: [String], required: true },
        SessionId: { type: String, required: true },
        Code: { type: Number, required: true },
        Host: { type: String, required: true },
        CreatedAt: { type: Date, default: Date.now },
    })
);