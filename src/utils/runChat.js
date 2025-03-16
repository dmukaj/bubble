import axios from "axios";

export async function runChat(userInput, messages, file, chatId) {
  if (!messages) return;

  const formData = new FormData();
  messages = formData.append("messages", JSON.stringify(messages));
  userInput = formData.append("userInput", JSON.stringify(userInput));

  if (file) {
    file = formData.append("file", file);
  }

  const response = await axios.post("/api/chat", formData, {
    params: { chatId },
  });
  return response.data;
}

export async function uploadToGemini(fileManager, filePath, mimeType) {
  const uploadResult = await fileManager.uploadFile(filePath, {
    mimeType,
    displayName: filePath.split("/").pop(),
  });
  const file = uploadResult.file;
  return file;
}

export async function waitForFilesActive(fileManager, files) {
  // console.log("Waiting for files to be active...", files);
  for (const name of files.map((file) => file.name)) {
    let file = await fileManager.getFile(name);
    while (file.state === "PROCESSING") {
      console.log("File is still processing...");
      await new Promise((resolve) => setTimeout(resolve, 10000)); // Poll every 10 seconds
      file = await fileManager.getFile(name);
    }
    if (file.state !== "ACTIVE") {
      throw new Error(`File ${file.name} failed to process`);
    }
  }
  // console.log("All files are ready");
}
