import { ChangeEvent, forwardRef, useCallback, useEffect } from "react";
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
} from "react-hook-form";
import { FileEditorProps } from "./types";
import { FileInput as GrommetFileInput } from "grommet";
import { FormField } from "../../types";
import { useSHFContext } from "../../../../context";

const FileEditor = forwardRef<HTMLInputElement, FormField<FileEditorProps>>(
  (props, ref) => {
    const {translate : T } = useSHFContext();
    let vrules = props.validationRules || {};

    let {
      name,
      defaultValue: initialValue,
      required,
      methods,
      multiple,
      label,
      fileInputProps
    } = props;

    if (required) {
      vrules.required = {
        value: required,
        message: T("required-msg", { name: label }),
      };
    }

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
        _: ChangeEvent<HTMLInputElement>,
        nextFiles:any
      ) => {
        field.onChange(nextFiles);
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
          rules={vrules as any}
          render={({ field }) => (
            <GrommetFileInput
              {...fileInputProps}
              name={name}
              ref={ref}
              multiple={multiple}
              //@ts-ignore
              onChange={handleChange(field)}
              messages={localizedMessages}
            />
          )}
        />
    );
  }
);

export {FileEditor};
