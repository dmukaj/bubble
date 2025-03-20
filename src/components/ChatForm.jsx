"use client";

import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { useState, useRef } from "react";
import { Loader, Send, UploadIcon } from "lucide-react";
import { runChat } from "@/utils/runChat";
// import TypingAnimation from "./TypingAnimation";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useChat } from "@/context/ChatContext";
// import { cn } from "@/lib/utils";
import { createChat } from "@/utils/createChat";
import { getRecentChats } from "@/utils/getRecentChats";

export default function ChatForm(className) {
  const inputRef = useRef(null);
  const params = useParams();
  const { setChats, setChatName, messages, setMessages } = useChat();
  const [input, setInput] = useState("");
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);
  const inputLength = input.trim().length;
  const pathname = usePathname();
  const router = useRouter();

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
    }
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    if (!inputRef || !inputRef.current) return;
    inputRef.current.click();
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (inputLength === 0) return;
    let chatId = params.chatId || "";

    if (pathname === "/home") {
      setMessages([]);
      chatId = await createChat(setChatName, setChats, input, file, pathname);
      const recentChats = await getRecentChats();
      setChats(recentChats);
      router.push(`/home/chat/${chatId}`);
    }
    // Push user message to state
    const userMessage = { role: "user", content: input, file };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setLoading(true);

    // get models response
    const result = await runChat(input, messages, file, chatId);

    const modelMessage = { role: "model", content: result.message };
    setMessages((prevMessages) => [...prevMessages, modelMessage]);
    // clear input
    setLoading(false);
    setFile(null);
  };

  return (
    <div className={className}>
      <div className=" flex flex-col items-center text-lg lg:text-3xl font-semibold text-center xl:w-[50dvw] w-[85dvw] mb-10 bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text">
        {pathname === "/home" && (
          // <TypingAnimation
          //   text={`Hello, I'am Bubble, your virtual assistant. How can I help you today?`}
          //   speed={50}
          //   className={cn(
          //     "text-lg lg:text-3xl font-semibold text-center lg:block mb-10 bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text"
          //   )}
          // />

          <h1>
            Hello, I&apos;am Bubble, your virtual assistant. How can I help you
            today?
          </h1>
        )}
      </div>
      <div className=" w-[90dvw] xl:w-[45dvw] flex items-center px-6 mb-6">
        <form
          onSubmit={handleSend}
          className=" flex w-full items-center space-x-2"
        >
          <Input
            id="message"
            placeholder="Type your message..."
            className="flex-1 text-xs md:text-base"
            autoComplete="off"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          {!loading ? (
            <Button type="submit" size="icon" disabled={inputLength === 0}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          ) : (
            <Button type="submit" size="icon" disabled={inputLength > 0}>
              <Loader className="h-4 w-4 text-blue-400" />
              <span className="sr-only">Send</span>
            </Button>
          )}

          <Input
            type="file"
            name="file"
            className="hidden text-xs md:text-base"
            ref={inputRef}
            onChange={handleFileUpload}
          />
          {file && (
            <div className=" rounded-lg px-2 py-2 text-xs md:text-sm lg:text-base bg-muted">
              <p>{file.name}</p>
            </div>
          )}
          <Button size="icon" onClick={handleButtonClick}>
            <UploadIcon className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
