"use server";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import path from "path";
import fs from "fs";
import { pipeline } from "stream/promises";
import { uploadToGemini, waitForFilesActive } from "@/utils/runChat";

export async function handleFileUpload(file) {
  const apiKey = process.env.GEMINI_API_KEY;
  const fileManager = new GoogleAIFileManager(apiKey);

  // Ensure file exists
  if (!file) return null;
  try {
    const fileStream = file.stream();
    const filePath = path.resolve(
      `${process.cwd()}/public/uploads/`,
      file.name
    );
    // Save file to local directory
    await pipeline(fileStream, fs.createWriteStream(filePath));

    // Upload file to Gemini and get file metadata
    const uploadedGeminiFile = await uploadToGemini(
      fileManager,
      filePath,
      file.type
    );

    const filesArray = [uploadedGeminiFile];
    // Wait for the file to become active in the system
    await waitForFilesActive(fileManager, filesArray);

    // Return the file URI
    console.log("File URI:", filesArray[0].uri);
    return filesArray[0].uri;
  } catch (error) {
    throw new Error(`Error uploading file:`, error);
  }
}
