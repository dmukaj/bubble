"use client";

import axios from "axios";
import { MenuIcon, NotebookPen, Minimize2, PlusCircleIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState, useCallback } from "react";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteChat } from "@/utils/deleteChat";
import { useChat } from "@/context/ChatContext";

import { getRecentChats } from "@/utils/getRecentChats";

const SideBar = () => {
  const [expand, setExpand] = useState(false);
  const { chats, setChats } = useChat();

  const router = useRouter();

  const handleDeleteChat = async (chatId) => {
    try {
      await deleteChat(chatId);
      setChats((prevState) =>
        prevState.filter((chat) => chat.chatId !== chatId)
      );
    } catch (error) {
      console.log("Error deleting chat", error);
    }
    router.push("/home");
  };

  const handleChatData = async () => {
    const recentChats = await getRecentChats();
    setChats(recentChats);
  };

  useEffect(() => {
    handleChatData();
  }, [setChats]);

  return (
    <div className="p-2 ">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setExpand(true)}
        className={`${
          !expand ? "translate-x-0" : "-translate-x-full" // Not visible when expanded && on md and above
        } xl:hidden`}
      >
        <MenuIcon />
      </Button>

      <aside
        className={`opacity-85 fixed top-0 left-0 z-40  w-[70dvw] md:w-[40dvw] lg:w-[30dvw] xl:w-[20dvw] h-screen transition-transform bg-gray-900 p-2
          ${expand ? "translate-x-0" : "-translate-x-full"} 
          xl:translate-x-0`} // Always visible on sm and above
      >
        {expand && (
          <Button
            className="transition-transform  md:translate-x-0 mb-6"
            variant="outline"
            size="icon"
            onClick={() => setExpand(false)} // Close sidebar when overlay is clicked
          >
            <Minimize2 />
          </Button>
        )}
        <div className="h-full px-2 overflow-y-auto ">
          <div className="flex flex-col gap-4">
            <Link
              href="/home"
              className="flex justify-start items-center text-white font-bold gap-1 "
            >
              <div className=" p-1 hover:bg-gray-400 rounded-xl">
                <PlusCircleIcon />
              </div>
              <p className="text-base md:text-lg lg:text-xl">Start New Chat</p>
            </Link>
            <div className="flex flex-col gap-4 text-white">
              <p className=" font-bold text-base md:text-lg lg:text-xl text-gray-400">
                Recent Chats
              </p>

              {Array.isArray(chats) &&
                chats.map((chat) => (
                  <div className="flex justify-between" key={chat.chatId}>
                    <Link
                      className="flex gap-3 justify-between text-nowrap overflow-hidden w-60"
                      href={`/home/chat/${chat.chatId}`}
                    >
                      <p className="flex items-start text-sm md:text-base lg:text-lg">
                        {chat.chatName}
                      </p>
                    </Link>
                    <Trash2
                      className="hover:text-red-500"
                      onClick={() => handleDeleteChat(chat.chatId)}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SideBar;

//bg-[url('/images/bg2.svg')] bg-no-repeat bg-cover bg-center
