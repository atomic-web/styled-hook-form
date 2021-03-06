import React from "react";
import { ErrorMessage } from "@hookform/error-message";
import { Box, Button, Tip, FormField, ThemeContext } from "grommet";
import { get, useFormState } from "react-hook-form";
import styled from "styled-components";
import { EditorWrapProps } from "./types";
import { CircleInformation } from "grommet-icons";
import { deepMerge } from "grommet/utils";
import { useContext } from "react";
import { FormFieldOptions, FormFieldType } from "../../../types";
import { PropType } from "types/utils";

export const StyledEditorWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.5em 0;
`;

const ValidationMessage = styled.span`
  color: ${(props) => props.theme.validation?.error?.color ?? "#f00"};
`;

const Label = styled.label`
  width: 15em;
`;

const inlineLabelControlTypes: PropType<FormFieldOptions, "type">[] = [
  FormFieldType.Boolean,
];

const WithEditorWrap: React.FC<EditorWrapProps> = (props) => {
  const { children, name, label, tip, renderLabel, editorType ,plain } = props;
  const { errors } = useFormState();
  let baseTheme = useContext(ThemeContext);

  let theme = deepMerge(baseTheme, {
    formField: {
      border: { position: "none" },
    },
  });

  let isInlineControl: boolean =
    inlineLabelControlTypes.indexOf(editorType) === -1;

  return (
    <ThemeContext.Extend value={theme}>
      <FormField
        margin={plain ? "0" : undefined}
        error={
          get(errors, name) ? (
            <ErrorMessage
                errors={errors}
                name={name}
                as={<ValidationMessage />}
              ></ErrorMessage>
          ) : undefined
        }
        contentProps={{
          focusIndicator: false,
        }}
        label={
          label && renderLabel && isInlineControl ? (
            <Label>
              {label}
              {tip && (
                <Tip
                  plain
                  content={
                    <Box
                      focusIndicator={false}
                      background="light-3"
                      pad="small"
                      round="small"
                      border={{
                        color: "dark-4",
                        size: "small",
                      }}
                    >
                      {tip}
                    </Box>
                  }
                  dropProps={{ align: { left: "right" } }}
                >
                  <Button
                    focusIndicator={false}
                    tabIndex={-1}
                    icon={<CircleInformation size="medium" color="neutral-3" />}
                  />
                </Tip>
              )}
            </Label>
          ) : undefined
        }
      >
        {children}
      </FormField>
    </ThemeContext.Extend>
  );
};

export default WithEditorWrap;
