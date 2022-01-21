import { fireEvent, getByTestId, getByText, render } from "@testing-library/react";
import "jest-styled-components";
import { act } from "react-dom/test-utils";
import { FormBuilder } from "../form-builder";
import { FormFieldType } from "../types";

describe("FormBuilder", () => {

  it("model overrides default value", () => {
    const DropDownField = () => {
      return (
        <div>
          <FormBuilder
            model={{
              test: "value2",
            }}
            fields={[
              {
                type: FormFieldType.Text,
                defaultValue: "value1",
                name: "test",
                label: "test",
              },
            ]}
          >
            {(methods) => (
              <div data-testid="value">{methods.watch("test")}</div>
            )}
          </FormBuilder>
        </div>
      );
    };

    let { container } = render(<DropDownField />);

    let value = getByTestId(container, "value").innerHTML;
    expect(value).toBe("value2");
  });

  it("onChange event fires when value changes", () => {
    jest.useFakeTimers();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    window.scrollTo = jest.fn();

    const Form = ({ onChange }: any) => {
      return (
        <div>
          <FormBuilder
            fields={[
              {
                type: FormFieldType.DropDown,
                options: [
                  { text: "Opt1", value: "opt1" },
                  { text: "Opt2", value: "opt2" },
                ],
                itemLabelKey: "text",
                itemValueKey: "value",
                name: "test",
                label: "test",
                placeholder: "dropdown",
                onChange: (v) => onChange && onChange(v),
              },
            ]}
          />
        </div>
      );
    };

    let onChangeFn = jest.fn();

    const { container } = render(<Form onChange={onChangeFn} />);

    let dp = getByText(container, "dropdown");
    fireEvent.click(dp);

    act(() => {
      jest.advanceTimersByTime(200);
    });

    let secondOption = getByText(document.body, "Opt2");

    fireEvent.click(secondOption);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(onChangeFn).toBeCalledWith("opt2");
  });
});

export {};
