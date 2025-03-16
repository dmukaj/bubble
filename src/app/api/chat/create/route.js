import { NextResponse } from "next/server";
import prisma from "@/prisma";
import { auth } from "@/auth";
import { uuidv7 } from "uuidv7";

export const POST = auth(async function POST(req) {
  const userId = req.auth?.user?.id;
  const name = await req.json();
  if (!userId) {
    return NextResponse.json({ message: "User not found" });
  }
  const chatId = uuidv7();
  const chatName = name.chatName || "New Chat";

  try {
    await prisma.Chat.create({
      data: {
        userId,
        chatId,
        chatName,
      },
    });

    return NextResponse.json({
      message: "Chat created successfully",
      chatId,
    });
  } catch (error) {
    console.log("Error creating chat", error);
    return NextResponse.json({ message: "Failed to create chat" });
  }
});
