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

    const { code } = await req.json();

    return NextResponse.json(
        { success: true },
        { status: 200 }
    )
}