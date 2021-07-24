import { FileInputProps  } from "grommet";

export interface FileEditorProps {
  multiple?: boolean;
  fileInputProps?: Omit<
  FileInputProps,
    "onChange" | "messages" | "multiple" | "ref" | "name"
  >;
}
