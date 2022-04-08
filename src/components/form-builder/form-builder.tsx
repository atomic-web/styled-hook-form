import React, {
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FormMethodsRef, WatchField } from "../form/types";
import Form from "../form";
import styled from "styled-components";
import { FormBuilderProps, FormField, FormFieldType } from "./types";
import { useFormContext, UseFormReturn, set } from "react-hook-form";
import { customLayout, gridLayout } from "./layouts";
import { SubFormEditorProps } from "./editors";
import { InternalContextProvider } from "./internal-context";
import { renderChildren } from "./layouts/shared";
import { PropType } from "types/utils";
import { equals } from "remeda";
import { filterProps } from "../utils/comp";
import { InternalFormContext } from "../form/internal-form-context";

const StyledFormBuilder = styled.div``;

export type FormChildProps = UseFormReturn;

const FormBuilder = forwardRef<FormMethodsRef | null, FormBuilderProps>(
  (props, ref) => {
    let {
      fields: originalFields,
      children,
      onSubmit,
      className,
      beforeSubmit,
      model,
      rows,
      columns,
      areas,
      options,
      layout = "GRID",
      editorWrapComponent,
      autoSubmitTreshould = 500,
      partialForm,
      ...rest
    } = props;

    const fieldsProp: FormField[] = originalFields ?? [];

    const internalFormContext = useContext(InternalFormContext);

    let fields = useMemo(
      () =>
        fieldsProp.filter(
          (f) =>
            f.visible === undefined || (f.visible !== undefined && f.visible)
        ),
      [fieldsProp]
    );

    const getAggValues = () => ({
      ...fields
        .reduce(
          (p: FormField[], c: FormField) => [
            ...p,
            ...(c.type === FormFieldType.SubForm
              ? (c as SubFormEditorProps).formProps?.fields ?? []
              : [c]),
          ],
          []
        )
        .reduce((p: any, c: FormField) => {
          if (c.name) {
            set(p, c.name, c.defaultValue);
          }
          return p;
        }, {}),
      ...model,
    });

    const isPartialForm = partialForm === true;
    let [defaultValues, setDefautValues] = useState(null);

    const defaultValueRef = useRef(null);

    useEffect(() => {
      const _aggValues = getAggValues();
      if (
        !defaultValueRef.current ||
        !equals(
          filterProps(
            defaultValueRef.current!,
            (key: string) => defaultValueRef.current![key] !== undefined
          ),
          filterProps(
            _aggValues,
            (key: string) => _aggValues[key] !== undefined
          )
        )
      ) {
        setDefautValues(_aggValues);
        defaultValueRef.current = _aggValues;
      }
    }, [model, originalFields]);

    const handleSubmit = isPartialForm
      ? () => 0
      : async (values: any) => {
          let shoudlSubmit: boolean | Promise<boolean> = beforeSubmit
            ? beforeSubmit(values)
            : true;
          if ((shoudlSubmit as any) instanceof Promise) {
            shoudlSubmit = await shoudlSubmit;
          }
          if (shoudlSubmit) {
            onSubmit?.call(null, values);
          }
        };

    let submitTriggers = fields
      .filter((f) => f.submitTrigger)
      .map(
        (f) => ({ name: f.name, defaultValue: f.defaultValue } as WatchField)
      );

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

    const items = useMemo(() => {
      const _items = fields.map((item, index) => ({
        ...item,
        order: item.order ?? index,
      }));

      _items.sort((a, b) => a.order! - b.order!);
      return _items;
    }, [fields]);

    const nullLayout = (
      methods: UseFormReturn,
      children: PropType<FormBuilderProps, "children">
    ) => <>{renderChildren(children as any, methods)}</>;

    const renderLayout = (methods: UseFormReturn) =>
      layout === "GRID"
        ? gridLayout({
            fields: items,
            methods,
            rows,
            columns,
            areas,
            children,
            options,
            model,
            editorWrapComponent,
          })
        : customLayout({
            layout,
            children,
            options,
            model,
            editorWrapComponent,
            fields: items,
            methods,
          });

    const formBody = isPartialForm
      ? React.createElement(
          React.Fragment,
          {},
          items.length
            ? renderLayout(useFormContext())
            : nullLayout(useFormContext(), children)
        )
      : React.createElement(
          Form,
          {
            ...(rest as object),
            options: {
              ...(options ?? {}),
              defaultValues,
            },
            submitTreshould: autoSubmitTreshould,
            methodsRef: ref,
            onSubmit: handleSubmit,
            autoSubmit: submitTriggers?.length > 0 ? true : false,
            autoSubmitFields: submitTriggers || [],
            changeHandlers: changeHandlers,
          },
          ({ ...methods }: UseFormReturn) =>
            items.length
              ? renderLayout(methods)
              : nullLayout(useFormContext(), children)
        );

    useEffect(() => {
      // this would be true if this is a partial form
      if (internalFormContext && isPartialForm) {
        if (submitTriggers) {
          internalFormContext.registerAutoSubmitField(submitTriggers);
        }
        if (changeHandlers) {
          internalFormContext.registerChangeHandler(changeHandlers);
        }
      }
    }, [internalFormContext, submitTriggers, changeHandlers]);

    return (
      <StyledFormBuilder className={className}>
        <InternalContextProvider
          formOptions={options}
          wrapComponent={editorWrapComponent}
        >
          {formBody}
        </InternalContextProvider>
      </StyledFormBuilder>
    );
  }
);

export { FormBuilder };
