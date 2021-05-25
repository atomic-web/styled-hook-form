import { render } from "@testing-library/react";
import { FormBuilder } from "../../../../form-builder/form-builder";
import { FormFieldType } from "../../../../form-builder/types";
import 'jest-styled-components'

describe("DropDown Editor", () => {
  it("renders default value", () => {
    const DropDownField = () => {
      return (
        <FormBuilder
          fields={[
            {
              type: FormFieldType.DropDown,
              options: [
                { text: "opt1", value: "Opt1" },
                { text: "opt2", value: "Opt2" },
              ],
              itemLabelKey: "text",
              itemValueKey: "value",
              defaultValue: "opt1",
              name: "test",
              label: "test",
            },
          ]}
        />
      );
    };

    let { container } = render(<DropDownField />);
    expect(container.firstElementChild).toMatchSnapshot();
  });
});

export {};
