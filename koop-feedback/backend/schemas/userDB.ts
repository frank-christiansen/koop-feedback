"use server";
import { model, models, Schema } from "mongoose";

export const userDB = models.user || model(
    "user",
    new Schema({
        UserId: { type: String, required: true },
        AuthId: { type: String, required: true },
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
                Id: { type: String, required: true },
            }
        ]
    })
);