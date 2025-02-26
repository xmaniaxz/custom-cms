"use server";
import { cookies } from "next/headers";
import {
  Client,
  Account,
  Users,
  Models,
  ID,
  Storage,
  Databases,
  Query,
} from "node-appwrite";
import { resolve } from "path";

const userCookie = "UserSession";

const CreateUserClient = async (): Promise<Client> => {
  const client = new Client();
  const endpoint: string = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
  const projectId: string = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;

  client.setEndpoint(endpoint).setProject(projectId);

  const session = (await cookies()).get(userCookie);
  if (!session || !session.value) {
    throw new Error("No session found");
  }

  client.setSession(session.value);
  return client;
};
const CreateUserAccount = async (): Promise<Account> => {
  const account = new Account(await CreateUserClient());
  return account;
};

const CreateAdminClient = async (): Promise<Client> => {
  const client = new Client();
  const endpoint: string = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
  const projectId: string = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
  const secretKey: string = process.env.NEXT_PUBLIC_APPWRITE_API_KEY!;
  // console.log(endpoint)
  client.setEndpoint(endpoint).setProject(projectId).setKey(secretKey);
  return client;
};

const CreateAdminAccount = async (): Promise<Account> => {
  const account = new Account(await CreateAdminClient());
  return account;
};

export const LoginUser = async (
  email: string,
  password: string
): Promise<Models.Session> => {
  const account = await CreateAdminAccount();
  const session = await account.createEmailPasswordSession(email, password);

  if (!session || !session.secret) {
    throw new Error("Session creation failed or secret is missing.");
  } else {
    // Set the cookie
    (await cookies()).set(userCookie, session.secret, {
      path: "/",
      httpOnly: false, // Ensure the cookie is not accessible via JavaScript
      sameSite: "strict", // 'lax' or 'none' based on your requirements
      secure: process.env.NODE_ENV === "production", // Ensure secure flag is set in production
      expires: SetExpiryDate(7), // Cookie expiry date)
    });

    return session;
  }
};

export async function LogoutUser() {
  try {
    const account = await CreateUserAccount();
    await account.deleteSession("current");
    (await cookies()).delete(userCookie);
  } catch (error) {
    return console.error("LogoutUser: " + error);
  }
}

export async function GetLoggedInUser() {
  try {
    const account = await CreateUserAccount();
    return await account.get();
  } catch (error) {
    return null;
  }
}

function SetExpiryDate(_Days: number) {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + _Days);
  return expiryDate;
}

export async function GetAllUsers() {
  const users = new Users(await CreateAdminClient());
  const result = await users.list();
  return result.users.map((user) => ({
    id: user.$id,
    name: user.name,
    email: user.email,
  }));
}

export async function CreateUser(
  username: string,
  email: string,
  password: string
) {
  const users = new Users(await CreateAdminClient());
  const response = await users.create(
    ID.unique(),
    email,
    undefined,
    password,
    username
  );
  if (response.name === username) {
    return { code: 200, message: "new user created" };
  }
  return { code: 404, message: "User creation failed" };
}

export async function UpdateUser(
  username: string,
  email: string,
  password: string,
  userId: string
) {
  const users = new Users(await CreateAdminClient());
  let updateMessage = `Successfully updated ${userId}: `;
  try {
    if (username) {
      await users.updateName(userId, username);
      updateMessage += `Username: ${username}, `;
    }
    if (email) {
      await users.updateEmail(userId, email);
      updateMessage += `Email: ${email}, `;
    }
    if (password) {
      await users.updatePassword(userId, password);
      updateMessage += `Password: ${password}, `;
    }
    return { code: 200, message: updateMessage };
  } catch (error) {
    return { code: 404, message: "User update failed" };
  }
}

export async function DeleteUser(userId: string) {
  const users = new Users(await CreateAdminClient());
  try {
    await users.delete(userId);
    return { code: 200, message: "User deleted" };
  } catch (error) {
    return { code: 404, message: "User deletion failed" };
  }
}

export async function SaveFile(bucketId: string, fileID: string, file: File) {
  const storage = new Storage(await CreateAdminClient());

  let response;
  if (
    !(await FileExists(bucketId, fileID)) &&
    fileID !== "" &&
    !(await FileNameExists(bucketId, file.name))
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
    []
  );

  if (response.$id) {
    return { code: 200, message: "File uploaded" };
  }
  return { code: 404, message: "File upload failed" };
}

export async function DeleteFile(
  bucketId: string,
  fileID?: string,
  fileName?: string
) {
  const storage = new Storage(await CreateAdminClient());
  try {
    let ID = fileID || "";
    if (fileName != "") {
      const response = await storage.listFiles(
        bucketId,
        [Query.limit(1)],
        fileName
      );
      ID = response.files[0].$id;
    }
    await storage.deleteFile(bucketId, ID);
    return { code: 200, message: "File deleted" };
  } catch (error) {
    return { code: 404, message: "File deletion failed" };
  }
}

export async function FileExists(bucketId: string, fileID: string) {
  const storage = new Storage(await CreateAdminClient());
  try {
    await storage.getFile(bucketId, fileID);
    return true;
  } catch (error) {
    return false;
  }
}
export async function FileNameExists(bucketId: string, fileName: string) {
  const storage = new Storage(await CreateAdminClient());
  const data = await storage.listFiles(bucketId, [], fileName);
  return data.files.length > 0;
}

export async function GetFileNames(bucketID: string, componentName: string) {
  const storage = new Storage(await CreateAdminClient());
  const data = await storage.listFiles(bucketID, [], componentName);
  console.log(data)
  return data.files;
}
export async function GetAllBucketFiles(bucketID: string) {
  const storage = new Storage(await CreateAdminClient());
  const data = await storage.listFiles(bucketID, [Query.limit(200)], ".tsx");
  return data.files;
}

export async function GetFileView(bucketId: string, fileID: string) {
  const storage = new Storage(await CreateAdminClient());
  try {
    return { code: 200, message: await storage.getFileView(bucketId, fileID) };
  } catch (error) {
    return { code: 404, message: "File view failed" };
  }
}

export async function WriteToDatabase(
  databaseID: string,
  collectionID: string,
  documentID: string,
  data: any
) {
  const database = new Databases(await CreateAdminClient());
  let response;
  try {
    response = await database.getDocument(databaseID, collectionID, documentID);
    // If document exists, update its content
    await database.updateDocument(databaseID, collectionID, documentID, data);
  } catch (error) {
    // If document does not exist, create a new one
    response = await database.createDocument(
      databaseID,
      collectionID,
      ID.unique(),
      data
    );
  }
  if (response.$id) {
    return { code: 200, message: "Document saved" };
  }
  return { code: 404, message: "Document save failed" };
}

export async function LoadFromDatabase(
  databaseID: string,
  collectionID: string,
  documentID: string
) {
  const database = new Databases(await CreateAdminClient());
  try {
    return {
      code: 200,
      message: await database.getDocument(databaseID, collectionID, documentID),
    };
  } catch (error) {
    return { code: 404, message: "Document load failed" };
  }
}

export async function LoadFromCollection(
  databaseID: string,
  collectionID: string
) {
  const database = new Databases(await CreateAdminClient());
  try {
    const response = await database.listDocuments(databaseID, collectionID, [
      Query.limit(200),
    ]);
    return {
      code: 200,
      message: response.documents,
    };
  } catch (error) {
    return { code: 404, message: "Document load failed" };
  }
}

export async function DeleteFromDatabase(
  databaseID: string,
  collectionID: string,
  documentID: string
) {
  const database = new Databases(await CreateAdminClient());
  // console.log(databaseID);
  // console.log(collectionID);
  // console.log(documentID);

  try {
    await database.deleteDocument(databaseID, collectionID, documentID);
    return { code: 200, message: "Document deleted" };
  } catch (error) {
    return { code: 404, message: "Document deletion failed" };
  }
}
