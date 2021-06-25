import useAxios from "axios-hooks";
import { FormBuilder, FormFieldType } from "../form-builder";
import React, { useCallback, useEffect, useMemo } from "react";
import { HttpFormProps } from "./types";
import { Box, Button, Spinner } from "grommet";
import { useSHFContext } from "../../context";
import staticAxios, { AxiosRequestConfig } from "axios";
import MockAdapter from "axios-mock-adapter";
import { FormMethodsRef } from "components/form/types";

const successCodes = [200, 201, 202];

const HttpForm = React.forwardRef<FormMethodsRef, HttpFormProps>(
  (props, ref) => {
    let {
      onSaveRequest,
      onSaveResponse,
      onLoadRequest,
      onLoadResponse,
      fields,
      saveRequest: saveReqProp,
      loadRequest: loadRequestProp,
      onSaveSuccess,
      onLoadSuccess,
      onSaveError,
      onLoadError,
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

    let saveRequest: AxiosRequestConfig = useMemo(() => {
      return typeof saveReqProp === "string"
        ? {
            url: saveReqProp,
          }
        : saveReqProp;
    }, [saveReqProp]);

    let loadRequest: AxiosRequestConfig | undefined = useMemo(() => {
      return typeof loadRequestProp === "string"
        ? {
            url: loadRequestProp,
          }
        : loadRequestProp;
    }, [loadRequestProp]);

    const [
      { loading, data, error: saveError, response: saveResponse },
      submitToServer,
    ] = useAxios(
      {
        ...saveRequest,
        transformResponse: useCallback((data, headers) => {
          if (typeof data === "string") {
            data = JSON.parse(data);
          }

          if (onSaveResponse) {
            data = onSaveResponse(data, headers);
          }

          return data;
        }, []),
        transformRequest: useCallback((data, headers) => {
          if (onSaveRequest) {
            data = onSaveRequest(data, headers);
          }
          return data;
        }, []),
      },
      {
        manual: true,
      }
    );

    const loadRequestOptions = {
      transformResponse: useCallback((data, headers) => {
        if (typeof data === "string") {
          data = JSON.parse(data);
        }

        if (onLoadResponse) {
          data = onLoadResponse(data, headers);
        }

        return data;
      }, []),
      transformRequest: useCallback((data, headers) => {
        if (onLoadRequest) {
          data = onLoadRequest(data, headers);
        }
        return data;
      }, []),
    };

    const [
      { data: serverData, response: loadResponse, error: loadError },
      getServerData,
    ] = useAxios(
      loadRequest
        ? {
            ...loadRequest,
            ...loadRequestOptions,
          }
        : { url: "/", ...loadRequestOptions }, // to make hook call order identical
      {
        manual: true,
      }
    );

    useEffect(() => {
      if (
        saveResponse &&
        saveResponse?.status &&
        successCodes.indexOf(saveResponse?.status) != -1
      ) {
        onSaveSuccess && onSaveSuccess(data);
      }
    }, [data]);

    useEffect(() => {
      onSaveError && saveError && onSaveError(saveError);
    }, [saveError]);

    useEffect(() => {
      if (
        loadResponse &&
        loadResponse?.status &&
        successCodes.indexOf(loadResponse?.status) != -1
      ) {
        onLoadSuccess && onLoadSuccess(data);
      }
    }, [serverData]);

    useEffect(() => {
      onSaveError && loadError && onSaveError(loadError);
    }, [loadError]);

    const handleSubmit = (data: any) => {
      if (mockResponse) {
        let mockAdapter = new MockAdapter(staticAxios);
        mockResponse(mockAdapter);
      }

      let hasFile : boolean = fields.some((f) => f.type === FormFieldType.File);
      let multipartEncoded : boolean = false;

      if (
        ["MUTIPART", "AUTO"].includes(encodingMode) && hasFile
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
        multipartEncoded = true;
      }

      if ( ["JSON", "AUTO"].includes(encodingMode) && !multipartEncoded){
          data = JSON.stringify(data);
      }

      submitToServer({
        data,
      });
    };

    useEffect(() => {
      if (loadRequest) {
        getServerData();
      }
    }, [loadRequest]);

    return (
      <FormBuilder
        {...rest}
        ref={ref}
        fields={fields}
        onSubmit={handleSubmit}
        model={model ?? serverData}
      >
        {children}
        {loadingIndicator}
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
