import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET() {
    const directoryUrl = "https://lostcausenetwork.com/files/";

    try {
        const res = await fetch(directoryUrl);
        const html = await res.text();

        // Extract filenames using regex (assumes NGINX autoindex format)
        const matches = [...html.matchAll(/<a href="([^"]+)"/g)];
        const files = matches
            .map((m) => m[1])
            .filter((file) => file !== "../"); // Ignore parent directory

        const fileList = files.map((file) => ({
            name: file,
            path: `/api/files/download?file=${encodeURIComponent(file)}`, // Secure download link
        }));

        return Response.json(fileList);
    } catch (error) {
        return Response.json({ error: "Failed to fetch directory listing" }, { status: 500 });
    }
}

