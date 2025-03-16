import { NextResponse } from "next/server";
import prisma from "@/prisma";
import path from "path";
import fs from "fs";
import { auth } from "@/auth";

export const POST = auth(async function POST(req) {
  const formData = await req.formData();
  const body = await req.json();
  const chatId = body.chatId;

  try {
    const userFile = formData.get("userFile");
    const userMessage = formData.get("userMessage");
    const modelMessage = formData.get("modelMessage");

    if (userFile) {
      const uploadDir = path.resolve(process.cwd(), "public/uploads/");

      // Ensure the directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      path.resolve(uploadDir, userFile.name);
    }

    const historyData = await prisma.History.create({
      data: {
        userId: req.auth?.user?.id,
        userMessage,
        modelMessage,
        chatId,
        fileName: userFile.name,
      },
    });
    return NextResponse.json({ success: true, historyData });
  } catch (e) {
    console.log("Error saving history", e);
    return NextResponse.json({
      success: false,
      message: "Failed to save message history",
    });
  }
});
