"use client";
import { useState, useEffect, useRef } from "react";
import {
  SaveFile,
  FileExists,
  GetFileNames,
  GetFileView,
} from "@/components/node-appwrite";
import {
  SandpackProvider,
  SandpackPreview,
  SandpackLayout,
} from "@codesandbox/sandpack-react";
import MonacoEditor from "@/components/monacoEditor";
import React from "react";

interface SiteComponentProps {
  componentName: string;
}

const sitecomponent: React.FC<SiteComponentProps> = ({ componentName }) => {
  const [initialTypescriptCode, setInitialTypescriptCode] = useState({
    documentid: "",
    data: `export default function App(): JSX.Element {
    return (
    <div>
        <p>Hello World</p>
       {/* begin typing here */}
    </div>
  );}`,
  });
  const [initialcssCode, setInitialcssCode] = useState({
    documentid: "",
    data: `@tailwind base;
@tailwind components;
@tailwind utilities;

@font-face {
  font-family: "Material Symbols Outlined";
  font-style: normal;
  font-weight: 100 700;
  src: url(https://fonts.gstatic.com/s/materialsymbolsoutlined/v170/kJEhBvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oFsI.woff2)
    format("woff2");
}

.Icon {
  font-family: "Material Symbols Outlined";
  font-weight: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  font-feature-settings: "liga";
  -moz-font-feature-settings: "liga";
  -moz-osx-font-smoothing: grayscale;
  user-select: none;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: inherit;
}

:root {
  --background: #ffffff;
  --bg-primary: #05082b;
  --foreground: #171717;
  --btn-primary: #05082b;
  --btn-tertiary: #5b5b5b86;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #1d1d1d;
    --bg-primary: #111111;
    --btn-primary: #0062ff;
    --btn-secondary: #0047ff;
    --foreground: #ededed;
  }
}

body {
  z-index: -2;
  color: var(--foreground);
  background: var(--background);
  font-family: Helvetica, sans-serif;
  margin: 0;
  padding: 0;
}`,
  });

  let typescriptCode: string = "";
  let cssCode: string = "";
  const bucketID = "677d1aad0014801461d2";

  const [containerHeight, setContainerHeight] = useState("60vh"); // Initial height in pixels

  const OnSave = async (extension: string, _file: string) => {
    let tempFile!: File;
    const filename = `${componentName}${extension}`;
    let fileID =
      extension === ".tsx"
        ? initialTypescriptCode.documentid
        : initialcssCode.documentid;
    if (!(await FileExists(bucketID, filename))) {
      // Create a File object with the correct MIME type
      tempFile = new File([_file], filename, {
        endings: "native",
      });
    }

    const response = await SaveFile(bucketID, fileID, tempFile);
    await GetFiles();
  };

  const GetFiles = async () => {
    const response = await GetFileNames(bucketID, componentName);
    response.forEach(async (file: any) => {
      if (file.name.includes(".tsx")) {
        const data = await GetFileView(bucketID, file.$id);
        const reader = new FileReader();
        reader.onload = () => {
          const text = reader.result;
          setInitialTypescriptCode({
            documentid: file.$id,
            data: text as string,
          });
        };
        reader.readAsText(new Blob([data.message]));
      } else if (file.name.includes(".css")) {
        const data = await GetFileView(bucketID, file.$id);
        const reader = new FileReader();
        reader.onload = () => {
          const text = reader.result;
          setInitialcssCode({ documentid: file.$id, data: text as string });
        };
        reader.readAsText(new Blob([data.message]));
      }
    });
  };

  useEffect(() => {
    cssCode = initialcssCode.data;
    typescriptCode = initialTypescriptCode.data;
    GetFiles();
  }, []);

  const onCallback = (value: any) => {
    if (value.activeLanguage === "tsx") {
      typescriptCode = value.value.code;
    } else if (value.activeLanguage === "css") {
      cssCode = value.value.code;
    }
  };

  return (
    <div className={`flex h-[${containerHeight}] flex-col`}>
      <section className="flex flex-col w-screen h-full px-24 gap-4">
        <p className="text-xl text-white">{componentName}</p>
        <div className="border-2 border-[#5b5b5b86] h-full rounded-[5px]">
          <SandpackProvider
            className="h-full"
            template="react-ts"
            theme="dark"
            files={{
              "/App.tsx": { code: initialTypescriptCode.data },
              "/styles.css": { code: initialcssCode.data },
            }}
          >
            <SandpackLayout className="h-full">
              <MonacoEditor
                _height={"100%"}
                OnUpdate={(value) => onCallback(value)}
              >
                <div className="flex flex-row justify-evenly gap-4">
                  <button
                    className="btn w-full p-1"
                    onClick={() => {
                      OnSave(".tsx", typescriptCode);
                      OnSave(".css", cssCode);
                    }}
                  >
                    Save
                  </button>
                  <button className="btn w-full p-1" onClick={() => {}}>
                    Upload
                  </button>
                </div>
              </MonacoEditor>
              <SandpackPreview />
            </SandpackLayout>
          </SandpackProvider>
        </div>
      </section>
    </div>
  );
};
export default sitecomponent;
