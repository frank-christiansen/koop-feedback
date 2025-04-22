"use server"

import { connectToDatabase } from "@/backend/database";
import { sessionDB } from "@/backend/schemas/sessionDB";
import { userDB } from "@/backend/schemas/userDB";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {

    await connectToDatabase();

    if (req.url.split("/")[2] != process.env.ALLWOED_API_URL) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }

    const sessionId = req.cookies.get("sessionId")?.value
    const authId = req.cookies.get("authId")?.value
    const sessionUserId = req.cookies.get("userId")?.value

    if (!sessionId || !sessionUserId || !authId) {
        return NextResponse.json(
            { error: true },
            { status: 401 }
        )
    }

    const user = await userDB.findOne({ UserId: sessionUserId, SessionId: sessionId, AuthId: authId })

    if (!user) {
        return NextResponse.json(
            { error: true },
            { status: 401 }
        )
    }

    if (user.IsHost == false) {
        return NextResponse.json(
            { error: true },
            { status: 401 }
        )
    }

    const userId = req.url.split("=")[1]

    const userToRemove = await userDB.findOne({ UserId: userId, SessionId: sessionId })
    if (!userToRemove) {
        return NextResponse.json(
            { error: true },
            { status: 401 }
        )
    }

    if (userToRemove.IsHost) {
        return NextResponse.json(
            { error: true },
            { status: 401 }
        )
    }
    if (userToRemove.UserId == sessionUserId) {
        return NextResponse.json(
            { error: true },
            { status: 401 }
        )
    }

    await userDB.deleteMany({ UserId: userId, SessionId: sessionId })
    await sessionDB.findOneAndUpdate({ SessionId: sessionId }, { $pull: { Users: userId } })

    return NextResponse.json(
        { success: true },
        { status: 200 }
    )
}