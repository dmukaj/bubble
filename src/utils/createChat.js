import axios from "axios";
import { generateChatName } from "@/utils/generateChatName";

export const createChat = async (
  setChats,
  setChatName,
  input,
  file,
  pathname
) => {
  let generatedChatName = "";

  // Generate chat name if it's the start of a new chat
  if (pathname === "/home") {
    generatedChatName = await generateChatName(input, file.name);
    setChatName(generatedChatName); // Set chatName in context
  }

  try {
    const result = await axios.post("/api/chat/create", {
      chatName: generatedChatName, // Send chatName in the request
    });

    const chatId = result.data.chatId;
    setChats((prevState) => [
      ...prevState,
      { chatName: generatedChatName, chatId },
    ]);

    return chatId;
  } catch (error) {
    console.error("Error creating chat", error);
  }
};
