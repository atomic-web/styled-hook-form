import { cleanup, render } from "@testing-library/react";
import { FormBuilder } from "../../../../form-builder";
import { FormField, FormFieldType } from "../../../../form-builder/types";
import { Box } from "grommet";
// import { FormBuilder } from "../../../../form-builder/form-builder";
// import { FormFieldType } from "../../../../form-builder/types";
// import "jest-styled-components";
// import { act } from "react-dom/test-utils";
describe("DropDown Editor", () => {
  afterEach(cleanup);

  it("custom label", () => {
    const Form = () => {
      return (
        <FormBuilder
          fields={
            [
              {
                name: "option",
                label: "option",
                type: FormFieldType.DropDown,
                defaultValue: ["opt1", "opt2"],
                options: [
                  {
                    text: "Opt1",
                    value: "opt1",
                  },
                  {
                    text: "Opt2",
                    value: "opt2",
                  },
                ],
                renderItemLabel: ({ text }: any) => {
                  return <Box>ITEM:{text}</Box>;
                },
                itemValueKey: "value",
                itemLabelKey: "text",
              },
            ] as FormField[]
          }
        />
      );
    };

    let { getAllByText } = render(<Form />);
    let elements = getAllByText(/ITEM:(Opt1|Opt2)/i);

    expect(elements.length).toBe(2);
  });
});

export {};
