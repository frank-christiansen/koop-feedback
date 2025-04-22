"use server"

import { connectToDatabase } from "@/backend/database";
import { sessionDB } from "@/backend/schemas/sessionDB";
import { userDB } from "@/backend/schemas/userDB";
import { NextRequest, NextResponse } from "next/server";
import { uuid } from "short-uuid";

export async function GET(req: NextRequest) {

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

    const user = await userDB.findOne({
        UserId: userId,
        AuthId: authId,
        SessionId: sessionId,
    });

    const userFeeback = user.Feedback.map((feedback: { Title: any; Description: any; CreatedAt: any; Id: any; }) => {
        return {
            Title: feedback.Title,
            Description: feedback.Description,
            CreatedAt: feedback.CreatedAt,
            Id: feedback.Id,
        }
    })

    return NextResponse.json(
        { feedback: userFeeback },
        { status: 200 }
    )
}

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

    if (session.IsStarted == false) return NextResponse.json(
        { error: "Session already started" },
        { status: 400 }
    )

    if (session.IsFinished) return NextResponse.json(
        { error: "Session already finished" },
        { status: 400 }
    )

    const { tite, description, feedbackUser, userSessionId } = await req.json();
    const feedbackId = uuid();

    const feedback = {
        Title: tite,
        Description: description,
        Id: feedbackId,
    }

    const userFeedback = await userDB.findOne({
        UserId: feedbackUser,
        SessionId: userSessionId,
    })

    if (!userFeedback) {
        return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
        )
    }

    if (userFeedback.UserId == userId) {
        return NextResponse.json(
            { error: "User cannot vote for himself" },
            { status: 400 }
        )
    }

    if (userFeedback.UserVotedForThisUser.includes(userId)) {
        return NextResponse.json(
            { error: "User already voted for this user" },
            { status: 400 }
        )
    }

    await userDB.findOneAndUpdate({
        UserId: feedbackUser,
        SessionId: userSessionId,
    }, {
        $push: { Feedback: feedback, UserVotedForThisUser: userId },
    })


    return NextResponse.json(
        { success: true },
        { status: 200 }
    )
}