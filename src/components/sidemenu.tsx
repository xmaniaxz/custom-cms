"use client";

import React, { useEffect, useState } from "react";

interface SlidingMenuProps {
  isMenuOpen: boolean;
  position: "top" | "left" | "bottom" | "right" | "center";
  width: string;
  height: string;
  children: React.ReactNode;
}

const SlidingMenu: React.FC<SlidingMenuProps> = ({
  isMenuOpen,
  position,
  width,
  height, 
  children,
}) => {
  const [MenuOpen, setMenuOpen] = useState(isMenuOpen);

  useEffect(() => {
    setMenuOpen(isMenuOpen);
  }, [isMenuOpen]);

  const styles = {
    container: {
      position: "fixed" as const,
      transition: "all 0.3s ease-in-out",
      ...(position === "top" && {
        top: 0,
        left: 0,
        right: 0,
        height: height,
        width: width,
        transform: MenuOpen ? "translateY(0)" : `translateY(-${height})`,
      }),
      ...(position === "bottom" && {
        bottom: 0,
        left: 0,
        right: 0,
        height: height,
        width: width,
        transform: MenuOpen ? "translateY(0)" : `translateY(${height})`,
      }),
      ...(position === "left" && {
        top: 0,
        left: 0,
        bottom: 0,
        width: width,
        height: height,
        transform: MenuOpen ? "translateX(0)" : `translateX(-${width})`,
      }),
      ...(position === "right" && {
        top: 0,
        right: 0,
        bottom: 0,
        width: width,
        height: height,
        transform: MenuOpen ? "translateX(0)" : `translateX(${width})`,
      }),
      ...(position === "center" && { 
        top: "50%",
        left: "50%",
        transform: MenuOpen ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -50%) scale(0)",
        width: width,
        height: height,
      })
    },
    content: {
      padding: "20px",
    },
  };

  return (
    <div style={styles.container} className="sideMenu">
      <div style={styles.content}>{children}</div>
    </div>
  );
};


export default SlidingMenu;
