"use client";

import { createContext, useContext, useState } from "react";

const ChatContext = createContext();
export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [chatName, setChatName] = useState("");
  const [messages, setMessages] = useState([]);

  return (
    <ChatContext.Provider
      value={{ chats, setChats, chatName, setChatName, messages, setMessages }}
    >
      {children}
    </ChatContext.Provider>
  );
};
