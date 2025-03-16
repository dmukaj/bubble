"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { signOutAction, signInAction } from "@/actions/signInAction";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

const NavBar = () => {
  const { toast } = useToast();
  const { data: session } = useSession();

  const handleSignIn = async () => {
    await signInAction();
    toast({
      title: "Success!",
      description: "User signed in successfully",
      variant: "success",
    });
  };

  return (
    <div className="flex gap-4 items-center absolute top-0 right-0 py-4 px-6 ">
      {!session && (
        <Button variant="outline" onClick={handleSignIn}>
          Sign In
        </Button>
      )}
      {session && (
        <>
          <h1>Hello {session?.user?.name}</h1>
          <Button variant="outline" onClick={() => signOutAction()}>
            Sign Out
          </Button>
        </>
      )}
    </div>
  );
};

export default NavBar;
