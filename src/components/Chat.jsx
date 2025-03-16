"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import ChatForm from "./ChatForm";
import { getChat } from "@/utils/getChat";
import { useParams } from "next/navigation";
import { useChat } from "@/context/ChatContext";
// import TypingAnimation from "./TypingAnimation";

const Chat = () => {
  const messageRef = useRef(null);
  const { messages, setMessages } = useChat();
  const [currentTypingMessage, setCurrentTypingMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const scrollToBottom = () => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleGetChat = useCallback(async () => {
    setLoading(true);
    const chat = await getChat(params);
    if (chat && chat.chats.length > 0) {
      const loadedMessages = chat.chats
        .map((chatItem) => {
          return [
            {
              role: "user",
              content: chatItem.userMessage,
            },
            {
              role: "user",
              content: chatItem.fileName,
            },
            { role: "model", content: chatItem.modelMessage },
          ].filter((message) => message.content); // Filter out empty messages
        })
        .flat();
      setMessages(loadedMessages);
    }
    setLoading(false);
  }, [params, setMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentTypingMessage]);

  useEffect(() => {
    handleGetChat();
  }, [handleGetChat]);

  const checkIfChatExists = async (messages) => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      // Only trigger typing animation for new model messages
      if (lastMessage.role === "model") {
        setCurrentTypingMessage(lastMessage.content);
      }
    }
  };

  useEffect(() => {
    checkIfChatExists(messages);
  }, [messages]);

  return (
    <div className="flex flex-col mt-20 items-center">
      <div className="flex flex-col items-center bg-accent pb-4 lg:h-[80dvh] xl:w-[55dvw] w-[90dvw] rounded-lg">
        <section className="flex flex-col items-center xl:w-[80vw] lg:w-[70vw] sm:w-[88%] h-[90vh] text:xs md:text-base lg:text-lg">
          <div className="flex-1 xl:w-[50dvw] w-[85dvw] overflow-y-auto py-4">
            <div>
              {!loading &&
                messages.length > 0 &&
                messages.slice(0, -1).map((message, index) => (
                  <div key={index}>
                    <div
                      key={index}
                      className={cn(
                        "flex w-max max-w-[60%] flex-col gap-2 rounded-lg px-2 py-1 text-xs md:text-base",
                        message.role === "user"
                          ? "ml-auto bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {message.content}
                    </div>

                    {message.file && (
                      <div className="flex w-max max-w-[60%] flex-col gap-2 rounded-lg px-2 py-1 ml-auto bg-primary text-xs md:text-base text-primary-foreground">
                        {message.file.name}
                      </div>
                    )}
                  </div>
                ))}
              {!loading && currentTypingMessage ? (
                <p className="flex w-max max-w-[60%] flex-col gap-2 rounded-lg px-2 py-1 text-xs md:text-base bg-white text-black">
                  {currentTypingMessage}
                </p>
              ) : (
                <div>Loading...</div>
              )}
            </div>

            <div ref={messageRef} />
          </div>

          <ChatForm
            messages={messages}
            setMessages={setMessages}
            className=" xl:w-[50dvw] w-[85dvw]"
          />
        </section>
      </div>
    </div>
  );
};

export default Chat;
