"use server"

import { connectToDatabase } from "@/backend/database";
import { NextRequest, NextResponse } from "next/server";
import { uuid } from "short-uuid";
import { sessionDB } from "@/backend/schemas/sessionDB";
import { userDB } from "@/backend/schemas/userDB";
import { cookies } from "next/headers";
import { log } from "console";
import type { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: NextRequest) {
    await connectToDatabase();

    const { name } = await req.json();

    const userUUID = uuid();
    const sessionUUID = uuid();
    const authId = uuid();

    const userData = {
        UserId: userUUID,
        SessionId: sessionUUID,
        AuthId: authId,
        Name: name,
        IsHost: true,
        UserVotedForThisUser: [],
        Feedback: [],
    }

    const sessionData = {
        Users: [userUUID],
        SessionId: sessionUUID,
        Code: Math.floor(1000 + Math.random() * 9000),
        Host: userUUID,
        IsStrarted: false,
        IsFinished: false,
    }

    await userDB.create(userData)
    await sessionDB.create(sessionData)

    const cookie = await cookies()
    cookie.set("sessionId", sessionUUID, {
        expires: new Date(Date.now() + 60 * 60 * 60 * 10),
    })
    cookie.set("userId", userUUID, {
        expires: new Date(Date.now() + 60 * 60 * 60 * 10),
    })
    cookie.set("authId", authId, {
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    })

    return NextResponse.json(
        { success: true },
        { status: 200 }
    );


}

export async function GET(req: NextRequest,) {
    await connectToDatabase();

    const cookie = await cookies()
    const sessionId = cookie.get("sessionId")?.value
    const userId = cookie.get("userId")?.value
    const authId = cookie.get("authId")?.value
    if (!sessionId || !userId || !authId) {
        return NextResponse.json(
            { error: true },
            { status: 401 }
        )
    }


    const session = await sessionDB.findOne({ SessionId: sessionId, Users: userId })
    const user = await userDB.findOne({ UserId: userId, SessionId: sessionId, AuthId: authId })

    if (!session || !user) {
        cookie.delete("sessionId")
        cookie.delete("userId")
        cookie.delete("authId")
        return NextResponse.json(
            { error: true },
            { status: 401 }
        )
    }

    async function getUsers() {
        const users = await userDB.find({ SessionId: sessionId })
        const usersData = users.map((user) => {
            return {
                UserId: user.UserId,
                SessionId: user.SessionId,
                Name: user.Name,
                IsHost: user.IsHost,
                UserVotedForThisUser: user.UserVotedForThisUser,
                Feedback: user.Feedback
            }
        })
        return usersData
    }
    const users = await getUsers()

    let doneUsers: string[] = []
    if (userId == session.Host) {
        doneUsers = session.DoneUsers
    }

    const sessionData = {
        SessionId: session.SessionId,
        Code: session.Code,
        Host: session.Host,
        Users: users,
        IsStarted: session.IsStarted,
        IsFinished: session.IsFinished,
        DoneUsers: doneUsers,
    }
    const userData = {
        UserId: user.UserId,
        SessionId: user.SessionId,
        Name: user.Name,
        IsDone: user.IsDone,
        IsHost: user.IsHost,
        UserVotedForThisUser: user.UserVotedForThisUser,
        Feedback: user.Feedback
    }
    return NextResponse.json(
        { session: sessionData, user: userData },
        { status: 200 }
    );
}