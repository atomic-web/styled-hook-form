import React, { useEffect, useState } from "react";
import Form from "../form";
import styled from "styled-components";
import { FormBuilderProps, FormField, ValidateWithMethods } from "./types";
import { EditorMap } from "./editor-map";
import { UseFormReturn, Validate, ValidateResult } from "react-hook-form";
import WidthEditorWrap from "./editors/shared/editor-wrap";
import { Box, Grid } from "grommet";

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
};

const renderField = (field: FormField, methods: UseFormReturn<any>) => {
  field.methods = methods;
  let component = React.createElement(EditorMap[field.type], {
    ...((field as unknown) as any),
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
    let children : React.ReactNode , props : any;

    // if (!p2 && p1){
    //   children = p1 as React.ReactNode;
    //   props = null;
    // }

    if (!p2 && p1){
      props = p1 as any;
      children = null;
    }

    if (p2){
      props = p2 as any;
      children = p1 as React.ReactNode;
    }

    if (!children && !props) {
      return component;
    }
    
    let clone = React.cloneElement(component, props ?? {}, children);
    return clone;
  };

  return (
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
};

const FormBuilder: React.FC<FormBuilderProps> = (props) => {
  let {
    fields,
    children,
    onSubmit,
    className,
    beforeSubmit,
    model,
    rows,
    columns,
    areas,
  } = props;

  const getAggValues = () => ({
    ...fields.reduce((p: any, c: FormField) => {
      p[c.name] = c.defaultValue;
      return p;
    }, {}),
    ...model,
  });

  let [defaulValues, setDefautValues] = useState(getAggValues);

  useEffect(() => {
    setDefautValues(getAggValues());
  }, [model, fields]);

  const handleSubmit = (values: any) => {
    let shoudlSubmit = beforeSubmit ? beforeSubmit(values) : true;
    if (shoudlSubmit) {
      onSubmit?.call(null, values);
    }
  };

  let submitTriggers = fields.filter((f) => f.submitTrigger).map((f) => f.name);

  const renderFieldEditors = (items: FormField[], methods: any) => {
    let groupedEditors: Record<string, any[]> = {};

    items = items.map((item, index) => ({
      ...item,
      order: item.order ?? index,
    }));

    items
      .sort((a, b) => a.order! - b.order!)
      .forEach((field) => {
        let fieldEditor = renderField(field, methods);
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
  };

  if (
    (rows && (!columns || !areas)) ||
    (columns && (!rows || !areas)) ||
    (areas && (!columns || !rows))
  ) {
    throw new Error(
      "`columns` , `rows` and `areas` should be defined defined together!"
    );
  }

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

  const renderChildren = (
    children: React.ReactChild | ((methods: UseFormReturn) => React.ReactNode),
    methods: UseFormReturn
  ) => (typeof children === "function" ? children(methods) : children);

  return (
    <StyledFormBuilder className={className}>
      <Form
        defaultValues={defaulValues}
        onSubmit={handleSubmit}
        autoSubmit={submitTriggers?.length > 0 ? true : false}
        watchFor={submitTriggers || []}
      >
        {({ ...methods }) => (
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
        )}
      </Form>
    </StyledFormBuilder>
  );
};

const formAdapter = () => {};

export { FormBuilder };
