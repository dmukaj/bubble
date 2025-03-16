import NavBar from "../../components/NavBar";
import "@/app/globals.css";
import SideBar from "../../components/SideBar";
// import { ChatProvider } from "@/context/ChatContext";

export default function RootLayout({ children }) {
  return (
    <>
      <NavBar />
      <SideBar />
      {children}
    </>
  );
}
