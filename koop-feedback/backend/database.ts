"use server";

import mongoose from "mongoose";

export async function connectToDatabase() {
    const dbURI = process.env.MONGODB_URI || "mongodb://localhost:27017/mydatabase";

    try {
        await mongoose.connect(dbURI, {
            dbName: process.env.MONGODB_DB_NAME,
        });
        console.log("Connected to MongoDB database successfully.");
    } catch (error) {
        console.error("Error connecting to MongoDB database:", error);
    }
}

