import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { FormMethodsRef, WatchField } from "../form/types";
import Form from "../form";
import styled from "styled-components";
import {
  FormBuilderProps,
  FormField,
  ValidateWithMethods,
} from "./types";
import { EditorMap } from "./editor-map";
import { UseFormReturn, ValidateResult } from "react-hook-form";
import WidthEditorWrap from "./editors/shared/editor-wrap";
import { Box, Grid, GridProps } from "grommet";
import { PropType } from "types/utils";

const StyledFormBuilder = styled.div``;

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
};export type FormChildProps = UseFormReturn;


const renderField = (
  field: FormField,
  methods: UseFormReturn<any>,
  editorComponent: React.ReactElement | undefined,
  shouldUnregister?: boolean
) => {
  field.methods = methods;
  let component = React.createElement(EditorMap[field.type], {
    ...((field as unknown) as any),
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
        return getValidateFuncWithMethods(userDefFunc, values, methods);
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
              methods
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

    // if (!p2 && p1){
    //   children = p1 as React.ReactNode;
    //   props = null;
    // }

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

  const EditorView = React.cloneElement(
    editorComponent ?? <React.Fragment />,
    {},
    <WidthEditorWrap
      key={field.name}
      {...(field as any)}
      editorType={field.type}
    >
      <>
        {field.render !== undefined &&
          field.render(wrapWithComponent(component), methods)}
        {field.render === undefined && component}
      </>
    </WidthEditorWrap>
  );

  return EditorView;
};

const FormBuilder = forwardRef<FormMethodsRef | null, FormBuilderProps>(
  (props, ref) => {
    let {
      fields: fieldsProp,
      children,
      onSubmit,
      className,
      beforeSubmit,
      model,
      rows,
      columns,
      areas,
      options,
      devMode,
      layout = "GRID",
      editorComponent,
    } = props;

    let fields = useMemo(
      () =>
        fieldsProp.filter(
          (f) =>
            f.visible === undefined || (f.visible !== undefined && f.visible)
        ),
      [fieldsProp]
    );

    const getAggValues = () => ({
      ...fields.reduce((p: any, c: FormField) => {
        p[c.name] = c.defaultValue;
        return p;
      }, {}),
      ...model,
    });

    let [defaultValues, setDefautValues] = useState(getAggValues);

    useEffect(() => {
      setDefautValues(getAggValues());
    }, [model, fields]);

    const handleSubmit = async (values: any) => {
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

    const renderFieldEditors = (items: FormField[], methods: any) => {
      let groupedEditors: Record<string, any[]> = {};

      items = items.map((item, index) => ({
        ...item,
        order: item.order ?? index,
      }));

      let sortedItems = items.sort((a, b) => a.order! - b.order!);

      if (layout === "GRID") {
        sortedItems.forEach((field) => {
          let fieldEditor = renderField(
            field,
            methods,
            editorComponent,
            options?.shouldUnregister
          );
          if (field.gridArea) {
            let existingArea = groupedEditors[field.gridArea];
            groupedEditors[field.gridArea] = existingArea
              ? [...existingArea, fieldEditor]
              : [fieldEditor];
          } else {
            groupedEditors["no-area"] = groupedEditors["no-area"]
              ? [...groupedEditors["no-area"], fieldEditor]
              : [fieldEditor];
          }
        });

        return Object.keys(groupedEditors).map((k) => (
          <Box gridArea={k} key={k} pad="small">
            {groupedEditors[k].map((field) => (
              <Box key={field.key}>{field}</Box>
            ))}
          </Box>
        ));
      }

      return sortedItems.map((field) =>
        renderField(field, methods, editorComponent, options?.shouldUnregister)
      );
    };

    if (
      layout === "GRID" &&
      ((rows && (!columns || !areas)) ||
        (columns && (!rows || !areas)) ||
        (areas && (!columns || !rows)))
    ) {
      throw new Error(
        "`columns` , `rows` and `areas` should be defined together!"
      );
    }

    const renderChildren = (
      children:
        | React.ReactChild
        | ((methods: UseFormReturn) => React.ReactNode),
      methods: UseFormReturn
    ) => (typeof children === "function" ? children(methods) : children);

    const renderCustomLayout = (methods: UseFormReturn) => {
      let layoutComponent = React.cloneElement(
        layout as React.ReactElement,
        {},
        <>
          {renderFieldEditors(fields, methods)}
          {renderChildren(children as any, methods)}
        </>
      );

      return layoutComponent;
    };

    const renderGrid = (
      methods: UseFormReturn,
      rows: PropType<GridProps, "rows">,
      columns: PropType<GridProps, "columns">,
      areas: PropType<GridProps, "areas">
    ) => {
      let gridDefined: boolean = true;

      if (!rows) {
        gridDefined = false;
        rows = ["flex", "xsmall"];
        columns = ["flex"];
        areas = [
          {
            name: "body",
            start: [0, 0],
            end: [0, 0],
          },
          {
            name: "actions",
            start: [0, 1],
            end: [0, 1],
          },
        ];
      }

      return (
        <Grid rows={rows} columns={columns} areas={areas} fill>
          {gridDefined ? (
            renderFieldEditors(fields, methods)
          ) : (
            <Box gridArea="body">{renderFieldEditors(fields, methods)}</Box>
          )}
          {children &&
            (gridDefined ? (
              renderChildren(children as any, methods)
            ) : (
              <Box gridArea="actions">
                {renderChildren(children as any, methods)}
              </Box>
            ))}
        </Grid>
      );
    };

    return (
      <StyledFormBuilder className={className}>
        <Form
          options={{
            ...(options ?? {}),
            defaultValues,
          }}
          methodsRef={ref}
          devMode={devMode}
          onSubmit={handleSubmit}
          autoSubmit={submitTriggers?.length > 0 ? true : false}
          autoSubmitFields={submitTriggers || []}
          changeHandlers={changeHandlers}
        >
          {({ ...methods }) => {
            return layout === "GRID"
              ? renderGrid(methods, rows, columns, areas)
              : renderCustomLayout(methods);
          }}
        </Form>
      </StyledFormBuilder>
    );
  }
);

export { FormBuilder };
