import { FormBuilder, FormFieldType } from "components";
import { render, fireEvent, act } from "test/test-utils";

describe("bool input", () => {
  it("adapts default value", () => {
    const { container } = render(
      <FormBuilder
        fields={[
          {
            name: "test",
            label: "",
            type: FormFieldType.Boolean,
            controlType: "switch",
            defaultValue: true,
            checkBoxProps: {
              id: "test",
            },
          },
        ]}
      />,
      {}
    );

    const input = container.querySelector("#test") as
      | HTMLInputElement
      | undefined;

    if (input) {
      expect(input.value).toBe("true");
    }
  });

  it("adapts model value", () => {
    const { container } = render(
      <FormBuilder
        model={{ test: true }}
        fields={[
          {
            name: "test",
            label: "",
            type: FormFieldType.Boolean,
            controlType: "switch",
            defaultValue: true,
            checkBoxProps: {
              id: "test",
            },
          },
        ]}
      />,
      {}
    );

    const input = container.querySelector("#test") as
      | HTMLInputElement
      | undefined;

    if (input) {
      expect(input.value).toBe("true");
    }
  });

  it("required validation works", async () => {
    const handleSubmit = jest.fn(() => {});

    await act(async() => {
      const { container } = render(
        <FormBuilder
          onSubmit={handleSubmit}
          fields={[
            {
              name: "test",
              label: "",
              required:true,
              type: FormFieldType.Boolean,
              controlType: "switch",
              checkBoxProps: {
                id: "test",
              },
            },
          ]}
        />,
        {}
      );

      const form = container.querySelector("form") as HTMLFormElement;
      fireEvent.submit(form);
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
