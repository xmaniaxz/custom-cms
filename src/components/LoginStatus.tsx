"use client"
import { useEffect } from "react";
import { GetLoggedInUser } from "@/components/node-appwrite";
import { redirect } from "next/navigation";

export default function LoginStatus() {
    async function IsLoggedIn() {
        const isLoggedIn = await GetLoggedInUser();
        if (!isLoggedIn) {
            redirect("/login");
        }
    }
    useEffect(() => {
        IsLoggedIn();
    }, []);
    return (
        <>
        </>
    );

}