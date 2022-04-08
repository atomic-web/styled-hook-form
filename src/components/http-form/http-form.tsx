import useAxios from "axios-hooks";
import { FormBuilder, FormFieldType } from "../form-builder";
import React, {
  ForwardedRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { HttpFormProps } from "./types";
import { Box, Button, Spinner } from "grommet";
import { useFormBuilderContext } from "../../context";
import staticAxios, { AxiosRequestConfig } from "axios";
import MockAdapter from "axios-mock-adapter";
import { FormMethodsRef } from "../form/types";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { isPrimitive } from "../utils/types";
import { FormField } from "../form-builder/types";
import { isAxiosCancel } from "../utils/http";

const successCodes = [200, 201, 202];

const HttpForm = React.forwardRef<FormMethodsRef, HttpFormProps>(
  (props, ref) => {
    let {
      onSaveRequest,
      onSaveResponse,
      onLoadRequest,
      onLoadResponse,
      fields: fieldsProp,
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

    const fields: FormField[] = fieldsProp ?? [];

    let { translate: T } = useFormBuilderContext();

    let methodsRef = useRef<UseFormReturn<FieldValues>>();
    const requestRef = useRef<{
      config: AxiosRequestConfig;
      completed: boolean;
    }>();

    const fallBackRef = (instance: FormMethodsRef) => {
      methodsRef.current = instance.methods;
    };

    const proxyRef = (origRef: ForwardedRef<FormMethodsRef>) => {
      return (instance: FormMethodsRef) => {
        fallBackRef(instance);
        if (origRef) {
          if (typeof origRef === "function") {
            origRef(instance);
          } else {
            origRef.current = instance;
          }
        }
      };
    };

    const formRef = proxyRef(ref);

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
          if (!data) {
            return data;
          }

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

          if (
            ["JSON", "AUTO"].includes(encodingMode) &&
            !(data instanceof FormData)
          ) {
            data = isPrimitive(data) ? data : JSON.stringify(data);
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
        if (!data) {
          return data;
        }

        if (typeof data === "string") {
          data = JSON.parse(data);
        }

        try {
          if (onLoadResponse) {
            data = onLoadResponse(data, headers);
          }
        } catch (e) {
          console.error(e);
        }
        if (methodsRef?.current) {
          //@ts-ignore
          methodsRef.current.control._avoidNotify = true;
          methodsRef.current.reset(data);
        }

        return data;
      }, []),
      transformRequest: useCallback((data, headers) => {
        if (onLoadRequest) {
          try {
            data = onLoadRequest(data, headers);
          } catch (e) {
            console.log(e);
          }
        }
        return data;
      }, []),
    };

    const [
      {
        loading: loadLoading,
        data: serverData,
        response: loadResponse,
        error: loadError,
      },
      getServerData,
    ] = useAxios("", {
      manual: true,
    });

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

      let hasFile: boolean = fields.some((f) => f.type === FormFieldType.File);

      if (["MUTIPART", "AUTO"].includes(encodingMode) && hasFile) {
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

    useEffect(() => {
      const aggConfig = loadRequest
        ? {
            ...loadRequest,
            ...loadRequestOptions,
          }
        : undefined;

      const request = aggConfig || requestRef?.current?.config;

      if (
        request &&
        ((requestRef.current &&
          (!requestRef.current.completed ||
            JSON.stringify(requestRef.current.config) !==
              JSON.stringify(loadRequest))) ||
          !requestRef.current)
      ) {
        requestRef.current = {
          config: request,
          completed: false,
        };

        getServerData(request)
          .then(() => {
            if (requestRef.current) {
              requestRef.current.completed = true;
            }
          })
          .catch((e) => {
            if (requestRef.current && !isAxiosCancel(e)) {
              requestRef.current.completed = true;
            }
          });
      }
    }, [loadRequest]);

    return (
      <FormBuilder
        {...rest}
        ref={formRef}
        fields={fields}
        onSubmit={handleSubmit}
        model={model}
      >
        {children}
        {(loading || loadLoading) && loadingIndicator}
        {submitButton && (
          <Button
            type="submit"
            primary
            icon={
              (loading || loadLoading) && !loadingIndicator ? (
                <Spinner />
              ) : undefined
            }
            label={
              <Box>
                {typeof submitButton === "boolean"
                  ? T("form-submit-label")
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
