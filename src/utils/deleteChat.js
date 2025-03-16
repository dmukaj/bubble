"use server";

import prisma from "@/prisma";

export const deleteChat = async (chatId) => {
  try {
    await prisma.Chat.delete({
      where: {
        chatId: chatId,
      },
    });
    return { message: "Chat deleted successfully", chatId };
  } catch (error) {
    console.log("Error deleting chat", error);
  }
};
