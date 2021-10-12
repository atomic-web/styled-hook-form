import { useFormContext, UseFormReturn, ValidateResult } from "react-hook-form";
import { FormChildren, FormField, FormFieldType, ValidateWithMethods } from "../types";
import { EditorMap } from "../editor-map";
import React from "react";
import WithEditorWrap from "../editors/shared/editor-wrap";

export const renderChildren = (
  children: FormChildren,
  methods: UseFormReturn
) => (typeof children === "function" ? children(methods) : children);

const getValidateFuncWithMethods = (
  validateFunc: ValidateWithMethods<any>,
  values: any,
  methods: UseFormReturn
): ValidateResult | Promise<any> => {
  let result = validateFunc(values, methods);
  if (result instanceof Promise) {
    return new Promise(async (res, rej) => {
      (result as Promise<any>).then((v) => res(v)).catch((e) => rej(e));
    });
  } else {
    return result;
  }
};

const hiddenFieldTypes = [FormFieldType.Hidden];

const isHidden = (field: FormField) => {
  return hiddenFieldTypes.includes(field.type);
};

export const renderField = (
  field: FormField,
  methods: UseFormReturn<any> | null,
  editorWrapComponent: React.ReactElement | undefined,
  model?: Record<string, any>,
  shouldUnregister?: boolean | undefined
) => {
  debugger
  const _methods = methods ?? useFormContext();
  field.methods = _methods;
  let component = React.createElement(EditorMap[field.type], {
    ...((field as unknown) as any),
    model,
    shouldUnregister: field.shouldUnregister ?? shouldUnregister,
    key: field.name,
  });

  if (field.renderLabel === undefined) {
    field.renderLabel = true;
  }

  if (field.validationRules && field.validationRules.validate) {
    if (typeof field.validationRules.validate === "function") {
      let userDefFunc = field.validationRules!
        .validate as ValidateWithMethods<any>;
      field.validationRules.validate = (values: any) => {
        return getValidateFuncWithMethods(userDefFunc, values, _methods);
      };
    } else {
      let rules = field.validationRules.validate as Record<string, any>;
      field.validationRules.validate = Object.keys(
        field.validationRules.validate!
      )
        .map((k) => [
          k,
          (values: any) =>
            getValidateFuncWithMethods(
              rules[k] as ValidateWithMethods<any>,
              values,
              _methods
            ),
        ])
        .reduce((p: any, c: any) => ((p[c[0]] = c[1]), p), {});
    }
  }

  const wrapWithComponent = (component: React.ReactElement) => (
    p1?: any,
    p2?: any
  ) => {
    let children: React.ReactNode, props: any;

    if (!p2 && p1) {
      props = p1 as any;
      children = null;
    }

    if (p2) {
      props = p2 as any;
      children = p1 as React.ReactNode;
    }

    if (!children && !props) {
      return component;
    }

    let clone = React.cloneElement(component, props ?? {}, children);
    return clone;
  };

  const editorBody =
    field.render !== undefined
      ? field.render(wrapWithComponent(component), _methods)
      : component;

  const EditorView = isHidden(field)
    ? editorBody
    : React.cloneElement(
        field.wrapComponent ?? editorWrapComponent ?? <React.Fragment />,
        {},
        <WithEditorWrap
          key={field.name}
          {...(field as any)}
          editorType={field.type}
        >
          {editorBody}
        </WithEditorWrap>
      );

  return EditorView;
};
