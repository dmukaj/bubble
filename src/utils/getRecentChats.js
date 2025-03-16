import axios from "axios";

export const getRecentChats = async () => {
  const result = await axios.get("/api/chat");
  // setChats(result.data.chatData);
  return result.data.chatData;
};
