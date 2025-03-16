"use client";

import { Button } from "@/components/ui/button";
import { signInAction } from "@/actions/signInAction";
import { useTransition } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SignIn() {
  const [isPending] = useTransition();
  const { toast } = useToast();

  const handleSignIn = async () => {
    await signInAction();
    toast({
      title: "Success!",
      description: "User signed in successfully",
      variant: "success",
    });
  };

  return (
    <form action={handleSignIn}>
      <div className="mx-auto w-full h-screen flex items-center justify-center bg-[url('/images/bg2.svg')] bg-cover bg-no-repeat">
        <div className="flex flex-col gap-6 items-center justify-center bg-white p-20 rounded-lg opacity-70">
          <div className="flex flex-col items-center lg:text-xl text-md gap-2">
            <h1 className="text-xl lg:text-3xl font-bold">Welcome</h1>
            <h2>I am Bubble, your virtual assistant</h2>
            <p>LogIn to chat with me</p>
          </div>
          <Button variant="default" type="submit" disabled={isPending}>
            {isPending ? "Signing In ..." : "SignIn with Google"}
          </Button>
        </div>
      </div>
    </form>
  );
}
