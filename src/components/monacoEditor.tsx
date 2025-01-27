"use client";
import Editor from "@monaco-editor/react";
import {
  useActiveCode,
  SandpackStack,
  FileTabs,
  SandpackCodeEditor,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { autocompletion } from "@codemirror/autocomplete";
import { useEffect } from "react";

interface MonacoEditorProps {
  _height: string;
  children?: React.ReactNode;
  OnUpdate: (value: any) => void;
}
const MonacoEditor: React.FC<MonacoEditorProps> = ({
  _height,
  children,
  OnUpdate,
}) => {
  const { sandpack } = useSandpack();
  const activeLanguage = sandpack.activeFile.split(".").pop();

  useEffect(() => {
    OnUpdate({ activeLanguage, value: sandpack.files[sandpack.activeFile] });
  }, [sandpack.files[sandpack.activeFile]]);
  return (
    <SandpackStack className={`h-[${_height}]`}>
      <SandpackCodeEditor showLineNumbers className="h-full" extensions={[autocompletion()]} />
      {children}
    </SandpackStack>
  );
};
export default MonacoEditor;
