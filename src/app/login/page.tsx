"use client";
import { useEffect, useState } from "react";
import {
  LoginUser,
  LogoutUser,
  GetLoggedInUser,
} from "@/components/node-appwrite";
import { redirect } from "next/navigation";
export default function Login() {
  const [user, setUser] = useState<any>(null);
  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = await LoginUser(
      formData.get("email") as string,
      formData.get("password") as string
    );
    IsLoggedIn();
  };
  async function IsLoggedIn() {
    const isLoggedIn = await GetLoggedInUser();
    setUser(isLoggedIn);
    if (isLoggedIn) {
      redirect("/dashboard");
    }
  }
  useEffect(() => {
    IsLoggedIn();
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-[40%] h-96 bg-primary p-6 rounded-lg shadow-lg">
        <form
          className="flex h-full flex-col justify-center space-y-4"
          onSubmit={onFormSubmit}
        >
          <h2 className="text-2xl font-bold text-center text-white">Login</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="p-2 input-primary rounded border"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="p-2 input-primary rounded border"
          />
          <button type="submit" className="p-2 w-48 btn-primary rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
