import { Box, Grid, GridProps } from "grommet";
import { UseFormReturn } from "react-hook-form";
import { PropType } from "types/utils";
import { FormBuilderProps, FormField } from "../types";
import { renderChildren, renderField } from "./shared";

const renderFieldEditors = ({
  items,
  methods,
  editorWrapComponent,
  shouldUnregister,
}: {
  items: FormField[];
  methods: any;
  editorWrapComponent: PropType<FormBuilderProps, "editorWrapComponent">;
  model: any;
  shouldUnregister: boolean | undefined;
}) => {
  let groupedEditors: Record<string, any[]> = {};

  items.forEach((field) => {
    let fieldEditor = renderField(
      field,
      methods,
      editorWrapComponent,
      shouldUnregister
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
      {groupedEditors[k].map((field, i) => {
        return <Box key={i}>{field}</Box>;
      })}
    </Box>
  ));
};

const gridLayout = ({
  fields,
  methods,
  rows,
  columns,
  areas,
  children,
  editorWrapComponent,
  options,
  model,
}: {
  fields: FormField[];
  methods: UseFormReturn;
  rows: PropType<GridProps, "rows">;
  columns: PropType<GridProps, "columns">;
  areas: PropType<GridProps, "areas">;
  children:  PropType<FormBuilderProps, "children">;
  editorWrapComponent: PropType<FormBuilderProps, "editorWrapComponent">;
  options: PropType<FormBuilderProps, "options">;
  model: any;
}) => {
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
        renderFieldEditors({
          model,
          items: fields,
          methods,
          editorWrapComponent,
          shouldUnregister: options?.shouldUnregister,
        })
      ) : (
        <Box gridArea="body">
          {renderFieldEditors({
            model,
            items: fields,
            methods,
            editorWrapComponent,
            shouldUnregister: options?.shouldUnregister,
          })}
        </Box>
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

export { gridLayout as default };
