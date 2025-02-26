"use client";
import { ID, Storage, Client, Query } from "appwrite";
import { FileExists, FileNameExists } from "@/components/node-appwrite";
async function CreateClient() {
  const Cookie = document.cookie;
  const userSession = document.cookie
    .split("; ")
    .find((row) => row.startsWith("UserSession="))
    ?.split("=")[1];

  if (!userSession) {
    throw new Error("UserSession cookie not found");
  }

  const client = new Client();
  client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string) // Your API Endpoint
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string) // Your project ID
    .setSession(userSession);
  return client;
}
//#region Unnessecary
export async function SaveFile(
  bucketId: string,
  fileID: string,
  file: File,
  onStatusUpdate?: (status: any) => void
) {
  const storage = new Storage(await CreateClient());

  let response;
  if (
    (await FileExists(bucketId, fileID)) &&
    fileID !== "" &&
    (await FileNameExists(bucketId, file.name))
  ) {
    // File exists, updating it
    response = await storage.deleteFile(bucketId, fileID);
    return;
  }

  console.log("Starting upload");

  response = await storage.createFile(
    bucketId,
    fileID !== "" ? fileID : ID.unique(),
    file,
    [],
    (progress) => {
      if (onStatusUpdate) {
        onStatusUpdate(progress);
      }
    }
  );

  if (response.$id) {
    return { code: 200, message: "File uploaded" };
  }
  return { code: 404, message: "File upload failed" };
}
//#endregion

export async function GetAllBucketFiles(bucketID: string) {
  const storage = new Storage(await CreateClient());
  const data = await storage.listFiles(bucketID, [Query.limit(200)]);
  return data.files;
}

export async function GetFileNames(bucketID: string, componentName: string) {
  const storage = new Storage(await CreateClient());
  const data = await storage.listFiles(bucketID, [], componentName);
  return data.files;
}

export async function GetUploadStatusOfAllFiles() {
  const Files = await GetAllBucketFiles("67aa1870001eaadbdcbb");
  const FilteredFiles = Files.filter(
    (file) => file.chunksTotal != file.chunksUploaded
  );
  return FilteredFiles.map((file) => {
    return {
      id: file.$id,
      name: file.name,
      percentage: ((file.chunksUploaded / file.chunksTotal) * 100).toFixed(1),
    };
  });
}
