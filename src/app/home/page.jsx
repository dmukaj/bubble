import React from "react";
import ChatForm from "@/components/ChatForm";

const page = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className=" mx-auto flex flex-col text-lg lg:justify-center md:max-w-3xl xl:max-w-[40rem] space-y-10 ">
        <ChatForm />
      </div>
    </div>
  );
};

export default page;
