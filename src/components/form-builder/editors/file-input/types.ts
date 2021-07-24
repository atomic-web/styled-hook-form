import { FileInputProps as GrommetFileInputProps } from "grommet";

export interface FileInputProps {
  multiple?: boolean;
  fileInputProps?: Omit<
    GrommetFileInputProps,
    "onChange" | "messages" | "multiple" | "ref" | "name"
  >;
}
