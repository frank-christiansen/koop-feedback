"use server"

import { connectToDatabase } from "@/backend/database";
import { sessionDB } from "@/backend/schemas/sessionDB";
import { userDB } from "@/backend/schemas/userDB";
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

    await userDB.create({
        UserId: userUUID,
        SessionId: session.SessionId,
        Name: name,
        IsHost: false,
        UserVotedForThisUser: [],
        Feedback: [],
    });

    await sessionDB.findOneAndUpdate(
        { Code: code },
        { $push: { Users: userUUID } }
    );

    return NextResponse.json(
        { success: true },
        { status: 200 }
    )
}