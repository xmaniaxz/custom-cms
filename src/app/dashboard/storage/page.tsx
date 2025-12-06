"use client";
import { useEffect, useState } from "react";
import StorageContainer from "@/components/storageContainers/storagecontainer";
import File from "@/components/storageContainers/file";

const StoragePage = () => {
  const getFiles = async () => {
    const response = await fetch("/api/files");
    console.log(await response.json());
  };

  const uploadFiles = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.multiple = true;

    fileInput.onchange = async (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files) {
        const fileObj: { name: string; type: string }[] = [];

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const formData = new FormData();
          formData.append("file", file);
          formData.append("projectID","4e959f6ac6734e06be5fce1aaab227f4");
          formData.append("bucket","minecraftFiles");
          const response = await fetch(
            "https://lostcausenetwork.com/files/upload.php",
            {
              method: "POST",
              body: formData,
            }
          );
          console.log(response);
        }
      }
    };

    fileInput.click();
  };

  return (
    <div className="w-[1600px] mx-auto">
      <button onClick={async () => await getFiles()}>GetFiles</button>
      <button onClick={async () => await uploadFiles()}>UploadFiles</button>
    </div>
  );
};

export default StoragePage;
