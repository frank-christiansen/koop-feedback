"use server"

import { connectToDatabase } from "@/backend/database";
import { sessionDB } from "@/backend/schemas/sessionDB";
import { userDB } from "@/backend/schemas/userDB";
import { log } from "console";
import { NextRequest, NextResponse } from "next/server";
import { uuid } from "short-uuid";

export async function POST(req: NextRequest) {

    await connectToDatabase();

    if (req.url.split("/")[2] != process.env.ALLWOED_API_URL) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }

    const sessionId = req.cookies.get("sessionId")?.value;
    const authId = req.cookies.get("authId")?.value;
    const userId = req.cookies.get("userId")?.value;

    const session = await sessionDB.findOne({
        SessionId: sessionId,
        Host: userId,
    });

    const user = await userDB.findOne({
        UserId: userId,
        AuthId: authId,
        SessionId: sessionId,
    });

    if (!session) {
        return NextResponse.json(
            { error: "Session not found" },
            { status: 404 }
        )
    }
    if (!user) {
        return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
        )
    }
    if (session.Host != userId) {
        return NextResponse.json(
            { error: "User is not host" },
            { status: 401 }
        )
    }



    session.Users.forEach(async (user: string) => {
        const userData = await userDB.findOne({ UserId: user, SessionId: sessionId });
        if (userData) {
            console.log("Deleting user data for user:", user);
            await userDB.deleteMany({ UserId: user, SessionId: sessionId });
        }
    })
    await sessionDB.deleteMany({ SessionId: sessionId }).then(() => {
        console.log("Session deleted successfully")
    })

    return NextResponse.json(
        { success: true },
        { status: 200 }
    )
}