"use client";

import React, { useState } from "react";
import SlidingMenu from "@/components/sidemenu";
import dynamic from "next/dynamic";

const AuthPage = dynamic(() => import("@/app/dashboard/auth/page"), {
  ssr: false,
});

const WebsitePage = dynamic(() => import("@/app/dashboard/website/page"), {
  ssr: false,
});

const DiscordPage = dynamic(() => import("@/app/dashboard/discord/page"), {
  ssr: false,
});
const StoragePage = dynamic(() => import("@/app/dashboard/storage/page"), {ssr: false});

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<
    "top" | "left" | "bottom" | "right"
  >("left");
  const [menuThickness, setMenuThickness] = useState("20vw");
  const [openPage, setOpenPage] = useState<string>("storage");

  const toggleMenu = (
    position: "top" | "left" | "bottom" | "right",
    thickness: string
  ) => {
    setMenuPosition(position);
    setMenuThickness(thickness);
    setMenuOpen(!menuOpen);
  };

  return (
    <div style={{ height: "100vh", overflowX: "hidden" }}>
      <SlidingMenu
        isMenuOpen={menuOpen}
        position={menuPosition}
        width={menuThickness}
        height="100vh"
      >
        <div>
          <h1>Menu</h1>
          <hr />
          <br />
          <ul className="menu-list flex flex-col items-center">
            <li onClick={() => setOpenPage("")}>Overview</li>
            <li onClick={() => setOpenPage("auth")}>Auth</li>
            <li onClick={() => setOpenPage("website")}>Website</li>
            <li onClick={() => setOpenPage("discord")}>Discord</li>
            <li onClick={() => setOpenPage("storage")}>Storage</li>
            <li onClick={() => setOpenPage("settings")}>Settings</li>
          </ul>
        </div>
      </SlidingMenu>
      <div
        style={{
          marginLeft: menuOpen && menuPosition === "left" ? menuThickness : "0",
          marginRight:
            menuOpen && menuPosition === "right" ? menuThickness : "0",
          marginTop: menuOpen && menuPosition === "top" ? menuThickness : "0",
          marginBottom:
            menuOpen && menuPosition === "bottom" ? menuThickness : "0",
          transition: "margin 0.3s ease-in-out",
          padding: "20px",
        }}
      >
        <button
          onClick={() => toggleMenu("left", "300px")}
          className="Icon text-[48px]"
        >
          menu
        </button>
        <div>
          {openPage === "auth" && <AuthPage />}
          {openPage === "website" && <WebsitePage />}
          {openPage === "discord" && <DiscordPage />}
          {openPage === "storage" && <StoragePage />}
        </div>
        {openPage == "" && (
          <>
            <p onClick={() => window.open("http://localhost:3001", "_blank")}>
              <i className="Icon">public</i> - Website
            </p>
            <p
              onClick={() =>
                window.open("https://appwrite.lostcausenetwork.com", "_blank")
              }
            >
              <i className="Icon">public</i> - Appwrite
            </p>
          </>
        )}
      </div>
    </div>
  );
}
