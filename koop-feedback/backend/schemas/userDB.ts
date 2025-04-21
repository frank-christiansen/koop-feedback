"use server";
import { model, Schema } from "mongoose";

export const sessionDB = model(
    "user",
    new Schema({
        UserId: { type: String, required: true },
        SessionId: { type: String, required: true },
        Name: { type: String, required: true },
        IsHost: { type: Boolean, required: true },
        CreatedAt: { type: Date, default: Date.now },
        UserVotedForThisUser: { type: [String], required: true },
        Feedback: [
            {
                Title: { type: String, required: true },
                Description: { type: String, required: true },
                CreatedAt: { type: Date, default: Date.now },
            }
        ]
    })
);