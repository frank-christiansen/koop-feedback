"use server"

import { connectToDatabase } from "@/backend/database";
import { sessionDB } from "@/backend/schemas/sessionDB";
import { userDB } from "@/backend/schemas/userDB";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { uuid } from "short-uuid";

export async function POST(req: NextRequest) {

    await connectToDatabase();

    const origin = req.headers.get("origin");

    if (origin !== process.env.ALLOWED_API_URL) {
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
        IsStarted: false,
        IsFinished: false,
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
    if (session.IsStarted) return NextResponse.json(
        { error: "Session already started" },
        { status: 400 }
    )

    if (session.IsFinished) return NextResponse.json(
        { error: "Session already finished" },
        { status: 400 }
    )

    if (session.Users.length < 2) return NextResponse.json(
        { error: "Not enough users" },
        { status: 400 }
    )

    await sessionDB.findOneAndUpdate(
        { SessionId: sessionId },
        {
            IsStarted: true,
        }
    );


    if (!session) {
        return NextResponse.json(
            { error: "Session not found" },
            { status: 404 }
        )
    }

    if (session.IsStarted) return NextResponse.json(
        { error: "Session already started" },
        { status: 400 }
    )
    if (session.IsFinished) return NextResponse.json(
        { error: "Session already finished" },
        { status: 400 }
    )


    return NextResponse.json(
        { success: true },
        { status: 200 }
    )
}