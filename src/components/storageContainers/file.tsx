import { useState } from "react";
"use client";

interface FileProps {
    fileName: string;
    onDelete: () => void;   
}

const File = ({ fileName, onDelete }: FileProps) => {
    const [isHovering, setIsHovering] = useState(false);

    const onButtonClick = () => {
        if(window.confirm("Are you sure you want to delete this file?")){
            onDelete();
        }
    };

    return (
        <button
            id="file"
            className="flex flex-col justify-center items-center"
            onClick={() => onButtonClick()}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div className="w-[200px] flex flex-col justify-center relative items-center">
            <i className={`Icon text-[200px] absolute ${isHovering ? "opacity-50" : "opacity-100"} transition-all`}>
                    folder_zip
                </i>
                <i className={`Icon text-[100px] text-red-600 absolute ${isHovering ? "opacity-100" : "opacity-0"} transition-all`}>
                    delete
                </i>
                <span className="mt-[200px]">{fileName}</span>
            </div>
        </button>
    );
};

export default File;
