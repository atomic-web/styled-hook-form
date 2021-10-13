import React, { FormEvent, useEffect, useMemo } from "react";
import { FormMethodsRef, WatchField } from "../form/types";
import {
  FormBuilderProps,
  FormChildren,
  UseFormBuilderInternalOptions,
} from "./types";
import {
  useFormContext,
  UseFormReturn,
  FormProvider,
  FieldValues,
} from "react-hook-form";
import styled from "styled-components";
import { customLayout, gridLayout } from "./layouts";
import { ChangeEventStore } from "components/form/change-event-store";
import { useDebouncedCallback } from "use-debounce/lib";
import { useInternalForm } from "../form/use-internal-form";

const StyledFormBuilder = styled.div``;

type FormBuilderInternalProps = Partial<FormBuilderProps>;

const useFormBuilderInternal = function <
  TModel extends FieldValues = FieldValues
>(options: UseFormBuilderInternalOptions<TModel>) {
  
  const Form = React.forwardRef<FormMethodsRef<TModel> | null,FormBuilderProps>(
    (_internalProps: FormBuilderInternalProps, _ref) => {
      const _props = { ...options, ..._internalProps };

      const {
        defaultValues: defaultValuesProp,
        autoSubmitTreshould = 500,
        methods: methodsProp,
        options: formOptions,
        editorWrapComponent,
        fields: fieldsProp,
        layout = "GRID",
        beforeSubmit,
        partialForm,
        autoRender,
        onSubmit,
        columns,
        model,
        areas,
        rows,
        ref: refProp,
        ...rest
      } = _props;

      const ref = _ref ?? refProp as React.ForwardedRef<FormMethodsRef<TModel>>;

      let fields = useMemo(
        () =>
          fieldsProp.filter(
            (f) =>
              f.visible === undefined || (f.visible !== undefined && f.visible)
          ),
        [fieldsProp]
      );

      const items = fieldsProp.map((item, index) => ({
        ...item,
        order: item.order ?? index,
      }));

      items.sort((a, b) => a.order! - b.order!);

      const { methods, defaultValues } =
        methodsProp && defaultValuesProp
          ? { methods: methodsProp, defaultValues: defaultValuesProp }
          : useInternalForm<TModel>(items, model as TModel, options.options);

      const renderLayout = (
        methods: UseFormReturn<TModel>,
        children: FormChildren
      ) =>
        layout === "GRID"
          ? gridLayout<TModel>({
              fields: items,
              methods,
              rows,
              columns,
              areas,
              children,
              options: options.options,
              model: options.model,
              editorWrapComponent,
            })
          : customLayout<TModel>({
              layout,
              children,
              options: options.options,
              model: options.model,
              editorWrapComponent,
              fields: items,
              methods,
            });

      let submitTriggers = fields
        .filter((f) => f.submitTrigger)
        .map(
          (f) => ({ name: f.name, defaultValue: f.defaultValue } as WatchField)
        );

      const autoSubmit = !!submitTriggers?.length;

      let changeHandlers = fields
        .filter((f) => f.onChange)
        .map(
          (f) =>
            ({
              name: f.name,
              defaultValue: f.defaultValue,
              handler: f.onChange,
            } as WatchField)
        );

      const isPartialForm = partialForm === true;
      const { children } = _props;

      const getChildren = (_methods: UseFormReturn<TModel>) =>
        autoRender && renderLayout
          ? renderLayout(_methods, children)
          : children;

      const control = methods?.control;

      let refObj: FormMethodsRef<TModel> = {
        methods,
        changeHandlers: new ChangeEventStore(),
      };

      if (ref && methods) {
        if (typeof ref === "function") {
          ref(refObj);
        } else {
          ref.current = refObj;
        }
      }

      const debuncedSubmit = useDebouncedCallback((values: any) => {
        onFormSubmit(values);
      }, autoSubmitTreshould);

      useEffect(() => {
        let watchSubscriptions: any;
        if (control) {
          watchSubscriptions = control._subjects.watch.subscribe({
            next: ({ name: changingName }: any) => {
              const getLiveValue = (
                name?: string | string[],
                defaultValues?: any
              ) => control._getWatch(name, defaultValues, false);
              if (changingName) {
                if (
                  autoSubmit &&
                  (!submitTriggers ||
                    !submitTriggers?.length ||
                    submitTriggers.some((f) => f.name === changingName))
                ) {
                  debuncedSubmit(getLiveValue());
                }

                const _value = getLiveValue(
                  changingName,
                  defaultValues[changingName]
                );

                if (ref) {
                  refObj.changeHandlers?.emitChange(changingName, _value);
                }

                let listener =
                  changeHandlers?.find((f) => f.name === changingName) ?? null;

                if (listener) {
                  listener.handler(_value);
                }
              }
            },
          });
        }

        return () => {
          if (watchSubscriptions) {
            watchSubscriptions.unsubscribe();
          }
        };
      }, []);

      const onFormSubmit = async (values: any) => {
        let shoudlSubmit: boolean | Promise<boolean> = beforeSubmit
          ? beforeSubmit(values)
          : true;
        if ((shoudlSubmit as any) instanceof Promise) {
          shoudlSubmit = await shoudlSubmit;
        }
        if (shoudlSubmit) {
          onSubmit?.call(null, values);
        }
        return true;
      };

      const handleFormSubmit = (e: FormEvent) => {
        e.stopPropagation();
        methods.handleSubmit(onFormSubmit)(e);
      };

      const contextMethods = useFormContext<TModel>();

      const FormElement = ({ children }: any) => (
        <form onSubmit={handleFormSubmit} {...rest}>
          <FormProvider {...methods}>{children}</FormProvider>
        </form>
      );

      const formBody = isPartialForm
        ? React.createElement(React.Fragment, {}, getChildren(contextMethods))
        : React.createElement(
            FormElement,
            {
              options: {
                ...(formOptions ?? {}),
              },
              methods,
              submitTreshould: autoSubmitTreshould,
              changeHandlers: changeHandlers,
            },
            getChildren(methods)
          );
      return <StyledFormBuilder>{formBody}</StyledFormBuilder>;
    }
  );

  return { Form };
};

export { useFormBuilderInternal };
