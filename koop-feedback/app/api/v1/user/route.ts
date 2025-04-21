"use server"

import { connectToDatabase } from "@/backend/database";
import { NextRequest, NextResponse } from "next/server";
import { uuid } from "short-uuid";
import { sessionDB } from "@/backend/schemas/sessionDB";
import { userDB } from "@/backend/schemas/userDB";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {

    await connectToDatabase();

    if (req.url.split("/")[2] != process.env.ALLWOED_API_URL) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }

    const userId = req.url.split("=")[1];

    const cookie = await cookies()

    if (!cookie.get("sessionId") || !cookie.get("userId")) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }

    const userUserId = cookie.get("userId")?.value;

    const isUser = await userDB.findOne({ UserId: userUserId });
    if (!isUser) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }

    const user = await userDB.findOne({ UserId: userId });

    if (!user) {
        return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
        )
    }

    const session = await sessionDB.findOne({ SessionId: user.SessionId });

    if (!session) {
        return NextResponse.json(
            { error: "Session not found" },
            { status: 404 }
        )
    }



    const sessionData = {
        SessionId: session.SessionId,
        Code: session.Code,
        Host: session.Host,
        Users: session.Users,
    }
    const userData = {
        UserId: user.UserId,
        SessionId: user.SessionId,
        Name: user.Name,
        IsHost: user.IsHost,
        CreatedAt: user.CreatedAt,
        UserVotedForThisUser: user.UserVotedForThisUser,
        Feedback: user.Feedback,
    }

    return NextResponse.json(
        { session: sessionData, user: userData },
        { status: 200 }
    );
}