import { NextResponse } from "next/server";
import { Client, ID, Storage } from "node-appwrite";
// In-memory object to store progress for each file
let progressData: { [key: string]: { progress: number; fileName: string } } =
  {};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const fileId = url.searchParams.get("fileId");

  if (!fileId || !progressData[fileId]) {
    return NextResponse.json({ error: "File ID not found" }, { status: 404 });
  }

  return NextResponse.json({ progress: progressData[fileId].progress, fileName: progressData[fileId].fileName });
}

export async function POST(req: Request) {
  const formData:FormData = await req.formData();
  const file:File = formData.get("file") as File;
  const bucketID : string= "67aa1870001eaadbdcbb";
  const fileExists : boolean = await FileNameExists(bucketID, file.name);
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const fileId = crypto.randomUUID();
  progressData[fileId] = { progress: 0, fileName: file.name };

  const storage = new Storage(await CreateAdminClient());

  let response;

  console.log("Starting upload");

  response = await storage.createFile(
    bucketID,
    fileExists ? fileId : ID.unique(),
    file,
    [],
    (progress) => {
      progressData[fileId].progress = progress.progress;
    }
  );

  return NextResponse.json({ fileId, progress: progressData[fileId].progress });
}

const CreateAdminClient = async (): Promise<Client> => {
  const client = new Client();
  const endpoint: string = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
  const projectId: string = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
  const secretKey: string = process.env.NEXT_PUBLIC_APPWRITE_API_KEY!;
  // console.log(endpoint)
  client.setEndpoint(endpoint).setProject(projectId).setKey(secretKey);
  return client;
};

async function FileExists(bucketId: string, fileID: string) {
  const storage = new Storage(await CreateAdminClient());
  try {
    await storage.getFile(bucketId, fileID);
    return true;
  } catch (error) {
    return false;
  }
}
async function FileNameExists(bucketId: string, fileName: string) {
  const storage = new Storage(await CreateAdminClient());
  const data = await storage.listFiles(bucketId, [], fileName);
  return data.files.length > 0;
}

