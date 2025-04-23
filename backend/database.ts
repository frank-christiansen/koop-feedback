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

}

async function deleteDataforDays() {
    await connectToDatabase()
    const sessions = await sessionDB.find().sort()

    for (const session of sessions) {
        // Session älter als 24h
        if (session.CreatedAt.getTime() < Date.now() - 1000 * 60 * 60 * 24) {
            await sessionDB.deleteOne({ SessionId: session.SessionId })
        }

        const users = await userDB.find({ SessionId: session.SessionId })
        for (const user of users) {
            // User älter als 7 Tage
            if (user.CreatedAt.getTime() < Date.now() - 1000 * 60 * 60 * 24) {
                await userDB.deleteOne({ SessionId: session.SessionId })
            }
        }
    }
}

export async function dbData() {
    setInterval(() => {
        deleteDataforDays().catch(console.error)
    }, 1000 * 60 * 5)
}


