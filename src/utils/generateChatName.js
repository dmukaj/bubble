export async function generateChatName(firstMessage, file) {
  //Remove common greetings and punctuation from the first message
  let cleanedMessage = null;
  if (file) {
    return (cleanedMessage = "Reading " + file.split(".")[0]);
  } else {
    cleanedMessage = firstMessage
      .replace(
        /(hello|hi|hey|howdy|good morning|good afternoon|good evening|morning|afternoon|evening|hello|hi|hey|howdy|good morning|good afternoon|good evening|morning|afternoon|evening)/i,
        "Greetings"
      )
      .trim();
    // Limit the name to a ceratin length
    return cleanedMessage.split(" ").slice(0, 5).join(" ") || "New Chat";
  }
}
