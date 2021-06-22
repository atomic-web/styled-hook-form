import useAxios from "axios-hooks";
import { FormBuilder,  FormFieldType } from "../form-builder";
import React, { useEffect } from "react";
import { HttpFormProps } from "./types";
import { Box, Button, Spinner } from "grommet";
import { useSHFContext } from "../../context";
import staticAxios from "axios";
import MockAdapter from "axios-mock-adapter";
import { FormMethodsRef } from "components/form/types";

const successCodes = [200, 201, 202];

const HttpForm = React.forwardRef<FormMethodsRef, HttpFormProps>(
  (props, ref) => {
    let {
      fields,
      request,
      onSuccess,
      onError,
      model,
      loadingIndicator,
      submitButton,
      resetButton,
      mockResponse,
      encodingMode = "AUTO",
      children,
      ...rest
    } = props;

    let { translate: T } = useSHFContext();
    let [{ loading, data, error, response }, submitToServer] = useAxios(
      request,
      {
        manual: true,
      }
    );

    useEffect(() => {
      if (response?.status && successCodes.indexOf(response?.status) != -1) {
        onSuccess && onSuccess(data);
      }
    }, [data]);

    useEffect(() => {
      onError && error && onError(error);
    }, [error]);

    const handleSubmit = (data: any) => {
      if (mockResponse) {
        let mockAdapter = new MockAdapter(staticAxios);
        mockResponse(mockAdapter);
      }

      if (
        ["MUTIPART", "AUTO"].includes(encodingMode) &&
        fields.some((f) => f.type === FormFieldType.File)
      ) {
        let formData = new FormData();

        for (let fieldName in data) {
          let field = data[fieldName];
          if (field instanceof FileList) {
            for (let [i, file] of Object.entries(field)) {
              formData.append(`${fieldName}[${i}]`, file);
            }
          } else {
            formData.append(fieldName, field);
          }
        }
        data = formData;
      }

      submitToServer({
        data,
      });
    };

    return (
      <FormBuilder
        {...rest}
        ref={ref}
        fields={fields}
        onSubmit={handleSubmit}
        model={model}
      >
        {children}
        {submitButton && (
          <Button
            type="submit"
            primary
            icon={loading && !loadingIndicator ? <Spinner /> : <div />}
            label={
              <Box>
                {typeof submitButton === "boolean"
                  ? T("form.submit.label")
                  : submitButton}
              </Box>
            }
          />
        )}
      </FormBuilder>
    );
  }
);

HttpForm.defaultProps = {
  submitButton: true,
  resetButton: false,
};

export { HttpForm };
