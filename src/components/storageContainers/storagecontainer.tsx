"use client";
import { useEffect, useState, Children } from "react";
import { SaveFile } from "@/components/node-appwrite";

interface StorageContainerProps {
  children?: React.ReactNode;
  containerData: { containerName: string };
  className?: string;
  onNameUpdate: (newName: string) => void;
  onFileUpdate: (files: object) => void;
  newContainer?: boolean;
}

const StorageContainer = ({
  children,
  containerData,
  className,
  onNameUpdate,
  onFileUpdate,
  newContainer,
}: StorageContainerProps) => {
  useEffect(() => {
    if (newContainer) {
      setIsEditing(newContainer);
    }
  }, []);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>(containerData.containerName || "");
  const [oldName, setOldName] = useState<string>("");

  const onButtonClick = () => {
    //create a hidden input element that activates when button is pressed
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.multiple = true;
    //when a file is selected, save it to the database
    fileInput.onchange = async (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files) {
        const fileObj = [];
        for (let i = 0; i < files.length; i++) {
          const response = await SaveFile("67aa1870001eaadbdcbb", "", files[i]);
          fileObj.push({name:files[i].name,type:files[i].type});
        }
        onFileUpdate(fileObj);
      }
    };
    fileInput.click();
  };
  const handleDeselect = () => {
    //console.log(name, oldName);
    if (name === "") {
      // if name is empty, set it back to the old name
      setName(oldName);
      onNameUpdate(name);

      return;
    }

    if (name !== oldName) {
      // check if name has changed
      if (window.confirm("Do you want to save the new name?")) {
        // Save the new name
        onNameUpdate(name);
        setOldName(name);
      } else {
        // Revert to the old name
        setName(oldName);
      }
    }
  };

  useEffect(() => {
    if (isEditing) setOldName(name);
  }, [isEditing]);

  return (
    <div className="w-full">
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={name}
          readOnly={!isEditing}
          onChange={(e) => setName(e.target.value)}
          className={`font-bold text-3xl bg-transparent text-white border-none ${
            isEditing ? "" : "pointer-events-none"
          }`}
          ref={(input) => {
            if (input && isEditing) {
              input.focus();
            }
          }}
          onBlur={() => handleDeselect()}
        />
        <button
          className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>
      <div className={className}>
        <button
          className={`Icon w-[${
            Children.count(children) > 0 ? "75px" : "200px"
          }] overflow-hidden opacity-[0.2] hover:opacity-[0.9] hover:w-[200px] transition-all text-[175px]`}
          onClick={() => onButtonClick()}
        >
          add
        </button>
        {children}
      </div>
    </div>
  );
};

export default StorageContainer;
