import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import dotenv from "dotenv";
import { auth } from "@/auth";
import { handleFileUpload } from "@/utils/handleFileUpload";
import prisma from "@/prisma";

dotenv.config();

export const GET = auth(async function GET(req) {
  const userId = req.auth?.user?.id;
  if (!userId) {
    return NextResponse.json({ message: "User not found" });
  }
  const chatData = await prisma.Chat.findMany({
    where: {
      userId,
    },
  });

  return NextResponse.json({ chatData });
});

export const POST = auth(async function POST(req) {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const searchParam = new URLSearchParams(req.url.split("?")[1]);
  const chatId = searchParam.get("chatId");

  const formData = await req.formData();

  const file = formData.get("file");
  let messages = formData.get("messages");

  const userInput = JSON.parse(formData.get("userInput"));

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `you are bubble, a friendly assistant that answers all users questions correctly. If the user uploads a file read the file's content
     and answer the questions that they have about those files. Do not ask for files if the user does not upload any but continue the conversation to assist the user. `,
  });
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  try {
    messages = JSON.parse(messages);

    const mappedHistory = messages.map((entry) => ({
      role: entry.role,
      parts: [{ text: entry.content }],
    }));

    const chatSession = model.startChat({
      generationConfig,
      history: [...mappedHistory],
    });

    // console.log("FILEEEEEEEE", fileUri);
    let result;
    const fileUri = await handleFileUpload(file);
    if (file) {
      result = await chatSession.sendMessage([
        userInput,
        {
          fileData: {
            fileUri: fileUri,
            mimeType: file.type,
          },
        },
      ]);
    } else {
      result = await chatSession.sendMessage(userInput);
    }

    await prisma.History.create({
      data: {
        userMessage: userInput,
        modelMessage: result.response.text(),
        userFile: fileUri || null,
        fileName: file ? file.name : null,
        chatId: chatId,
        userId: req.auth.user.id,
      },
    });

    return NextResponse.json({ message: result.response.text() });
  } catch (error) {
    console.log("error ::://///", error);
    return NextResponse.json({
      message:
        "So sorry 😔, you can only upload one file at a time of type pdf, jpg, png, or txt",
    });
  }
});
