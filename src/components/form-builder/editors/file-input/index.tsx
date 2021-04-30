import { ChangeEvent, forwardRef, useCallback, useEffect } from "react";
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
} from "react-hook-form";
import { FileInputProps } from "./types";
import { FileInput as GrommetFileInput } from "grommet";
import { FormField } from "../../types";
import useTranslation from "next-translate/useTranslation";

const FileInput = forwardRef<HTMLInputElement, FormField<FileInputProps>>(
  (props, ref) => {
    const { t: T } = useTranslation("form");

    let {
      name,
      defaultValue: initialValue,
      required,
      methods,
      multiple,
      onChange,
    } = props;

    let control = methods?.control;

    const localizedMessages = {
      browse: T("file-input-msg-browse"),
      dropPrompt: T("file-input-msg-drop-prompt"),
      dropPromptMultiple: T("file-input-msg-drop-prompt-multiple"),
      files: T("files"),
      remove: T("remove"),
      removeAll: T("remove all")
    };

    const handleChange = useCallback(
      (field: ControllerRenderProps<FieldValues>) => (
        e: ChangeEvent<HTMLInputElement>
      ) => {
        field.onChange(e.target.files);
        onChange?.call(null, e.target.value);
      },
      []
    );

    useEffect(()=>{
      if (ref && typeof(ref) !== "function"){
          if(ref.current){
            ref.current.setCustomValidity(T("file-input-msg-file-required"));
          }
      }     
    },[ref]);

    return (
        <Controller
          name={name}
          defaultValue={initialValue}
          control={control}
          render={({ field }) => (
            <GrommetFileInput
              name={name}
              ref={ref}
              required={required}
              multiple={multiple}
              onChange={handleChange(field)}
              messages={localizedMessages}
            />
          )}
        />
    );
  }
);

export default FileInput;
