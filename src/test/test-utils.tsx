import {
  Queries,
  queries,
  render as RTLRender,
  RenderOptions,
} from "@testing-library/react";
import { FormBuilderContextProvider } from "../context";
import { TranslatorFunc } from "../context/types";
import { ThemeType } from "grommet";
import React from "react";
import userEvent from "@testing-library/user-event";

export interface CustomRenderOptions<
  Q extends Queries = typeof queries,
  Container extends Element | DocumentFragment = HTMLElement
> extends RenderOptions<Q, Container> {
  theme?: ThemeType;
  translator?: TranslatorFunc;
}

export function render<
  Q extends Queries = typeof queries,
  Container extends Element | DocumentFragment = HTMLElement
>(ui: React.ReactElement, options: CustomRenderOptions<Q, Container>) {
  const Wrapper = ({ children }: any) => {
    return (
      <FormBuilderContextProvider
        options={{
          renderGrommet: true,
          theme: options.theme,
          translator: options.translator,
        }}
      >
        {children}
      </FormBuilderContextProvider>
    );
  };

  return RTLRender(ui, { ...options, wrapper: Wrapper });
}

export * from "@testing-library/react";
export { userEvent };
