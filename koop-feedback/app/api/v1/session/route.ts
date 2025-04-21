"use server"

import { connectToDatabase } from "@/backend/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await connectToDatabase();


}