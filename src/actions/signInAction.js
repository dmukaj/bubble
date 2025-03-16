"use server";
import { signIn, signOut } from "@/auth";

export const signInAction = async () => {
  try {
    await signIn("google", {
      redirect: true,
      redirectTo: "/home",
    });
  } catch (e) {
    console.log("error HERE", e);
    throw e;
  }
};

export const signOutAction = async () => {
  await signOut({ redirectTo: "/signIn", redirect: true });
};
