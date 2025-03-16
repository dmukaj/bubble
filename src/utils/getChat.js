import axios from "axios";

export const getChat = async (params = {}) => {
  const response = await axios.get(`/api/getChat/${params.chatId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
