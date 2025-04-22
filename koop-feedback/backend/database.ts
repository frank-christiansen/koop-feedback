"use server";

import mongoose from "mongoose";
import { sessionDB } from "./schemas/sessionDB";
import { userDB } from "./schemas/userDB";

export async function connectToDatabase() {
    const dbURI = process.env.MONGODB_URL || "mongodb://localhost:27017/mydatabase";

    try {
        await mongoose.connect(dbURI, {
            dbName: process.env.MONGODB_DB_NAME,
        });
        console.log("Connected to MongoDB database successfully.");
    } catch (error) {
        console.error("Error connecting to MongoDB database:", error);
    }
    // Delete UserData 
    const sessions = await sessionDB.find().sort()
    sessions.forEach(async (session) => {
        if (session.CreatedAt.getTime() < Date.now() - 1000 * 60 * 60 * 24 * 7) {
            await sessionDB.deleteOne({ SessionId: session.SessionId })
        }
        const users = await userDB.find({ SessionId: session.SessionId })
        users.forEach(async (user) => {
            if (user.CreatedAt.getTime() < Date.now() - 1000 * 60 * 60 * 24 * 7) {
                await userDB.deleteOne({ SessionId: session.SessionId })
            }
        })
    })
}

