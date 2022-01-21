import { FileInputProps  } from "grommet";

export interface FileEditorProps {
  multiple?: boolean;
  onRemove?:(files : File[])=>void,
  fileInputProps?: Omit<
  FileInputProps,
    "onChange" | "messages" | "multiple" | "ref" | "name"
  >;
}
