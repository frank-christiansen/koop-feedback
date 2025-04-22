"use server"

import { connectToDatabase } from "@/backend/database";
import { sessionDB } from "@/backend/schemas/sessionDB";
import { userDB } from "@/backend/schemas/userDB";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { uuid } from "short-uuid";

export async function POST(req: NextRequest) {

    await connectToDatabase();


    const { code, name } = await req.json();

    const userUUID = uuid();

    const session = await sessionDB.findOne({
        Code: code,
        IsStarted: false,
        IsFinished: false,
    });

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
    const authId = uuid();

    await userDB.create({
        UserId: userUUID,
        SessionId: session.SessionId,
        AuthId: authId,
        Name: name,
        IsHost: false,
        UserVotedForThisUser: [],
        Feedback: [],
    });

    const cookie = await cookies();
    cookie.set("sessionId", session.SessionId, {
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    })
    cookie.set("userId", userUUID, {
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    })
    cookie.set("authId", authId, {
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    })

    await sessionDB.findOneAndUpdate(
        { Code: code },
        { $push: { Users: userUUID } }
    );

    return NextResponse.json(
        { success: true },
        { status: 200 }
    )
}