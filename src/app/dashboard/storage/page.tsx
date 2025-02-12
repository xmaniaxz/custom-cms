"use client";
import { useEffect, useState } from "react";
import StorageContainer from "@/components/storageContainers/storagecontainer";
import {
  WriteToDatabase,
  DeleteFromDatabase,
  LoadFromCollection,
  DeleteFile
} from "@/components/node-appwrite";
import File from "@/components/storageContainers/file";

const StoragePage = () => {
  const [storageContainers, setStorageContainers] = useState<
    { containerID: string; containerName: string; files: { name: string }[] }[]
  >([]);
  const [newestContainer, setNewestContainer] = useState<number>(-1);
  const serverFileDB = "677fa96000311c0521fc";
  const serverFileCollection = "67aa3429001e3be61ce9";
  const bucketID = "67aa1870001eaadbdcbb";

  const handleAddContainer = () => {
    setStorageContainers([
      ...storageContainers,
      { containerID: "", containerName: "", files: [] },
    ]);
    setNewestContainer(storageContainers.length);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await LoadFromCollection(
        serverFileDB,
        serverFileCollection
      );
      if (response.code === 200 && Array.isArray(response.message)) {
        const newContainers = response.message.map((doc: any) => ({
          containerID: doc.$id,
          containerName: doc.rootfolder,
          files: doc.files.map((file: string) => JSON.parse(file)),
        }));
        setStorageContainers(newContainers);
      }
    };
    fetchData();
  }, []);

  const handleNameUpdate = async (name: string, index: number) => {
    setNewestContainer(-1);
    if (name === "") {
      if (storageContainers[index].containerID !== "") {
        const response = await DeleteFromDatabase(
          serverFileDB,
          serverFileCollection,
          storageContainers[index].containerID
        );
        console.log(response);
      }
      setStorageContainers(storageContainers.filter((_, i) => i !== index));
      return;
    } else {
      storageContainers[index].containerName = name;
      UpdateContainer(index);
    }
  };

  const UpdateContainer = async (index: number) => {
    const files = storageContainers[index].files.map((file) =>
      JSON.stringify(file)
    );
    const response = await WriteToDatabase(
      serverFileDB,
      serverFileCollection,
      storageContainers[index].containerID,
      {
        rootfolder: storageContainers[index].containerName,
        files: files,
      }
    );
  };

  const handleFileDeletion = async (index: number, fileIndex: number) => {
    const response = await DeleteFile(bucketID, "", storageContainers[index].files[fileIndex].name);
    setStorageContainers((prevContainers) => {
      const updatedContainers = [...prevContainers];
      updatedContainers[index].files = updatedContainers[index].files.filter(
        (_, i) => i !== fileIndex
      );
      return updatedContainers;
    });
    UpdateContainer(index);
  };

  const handleFileUpdate = (files: { name: string }[], index: number) => {
    setStorageContainers((prevContainers) => {
      const updatedContainers = [...prevContainers];
      const existingFiles = updatedContainers[index].files.map(file => file.name);
      const newFiles = files.filter(file => !existingFiles.includes(file.name));
      updatedContainers[index].files = [
        ...updatedContainers[index].files,
        ...newFiles,
      ];
      return updatedContainers;
    });
    UpdateContainer(index);
  };

  return (
    <div className="w-[1600px] mx-auto">
      {storageContainers.map((container, index) => (
        <StorageContainer
          key={index}
          containerData={container}
          newContainer={newestContainer === index}
          className="flex items-center gap-4 w-full min-h-[200px] rounded-lg overflow-x-scroll bg-black bg-opacity-50"
          onNameUpdate={(name) => {
            handleNameUpdate(name, index);
          }}
          onFileUpdate={(files) => {
            handleFileUpdate((files as {name:string}[]), index);
          }}
        >
          {container.files.map((file, fileIndex) => {
            console.log(file.name);
            return (
              <File
                key={fileIndex}
                fileName={file.name}
                onDelete={() => {
                  handleFileDeletion(index, fileIndex);
                }}
              />
            );
          })}
        </StorageContainer>
      ))}
      <br />
      <button
        className="h-40 rounded-lg w-full flex items-center border border-black justify-center bg_transparent_black text-3xl h-4 "
        onClick={handleAddContainer}
      >
        Add container
      </button>
    </div>
  );
};

export default StoragePage;