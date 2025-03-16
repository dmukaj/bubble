import { NextResponse } from "next/server";
import prisma from "@/prisma";
import { auth } from "@/auth";

export const GET = auth(async function GET(req, res) {
  const userId = req.auth?.user?.id;

  if (!userId) {
    return NextResponse.json({ message: "User not found" });
  }

  try {
    const chats = await prisma.History.findMany({
      where: {
        userId,
        chatId: res.params.chatId,
      },
    });

    return NextResponse.json({ success: true, chats });
  } catch (error) {
    console.log("Error getting chats", error);
    return NextResponse.json({ message: "Failed to get chats" });
  }
});
