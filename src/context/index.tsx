import React, { createContext, Reducer, useContext, useReducer } from "react";
import { DefaultTheme } from "styled-components";
import { FormBuilderTheme } from "../themes/base-theme";
import { Grommet } from "grommet";
import {
  FormBuilderContextModel,
  FormBuilderContextProviderProps,
  FormBuilderContextProviderValue,
} from "./types";
import { translate as FallbackTranslate } from "./actions";
import { FormBuilderContextReducerAction } from "./actions/types";

export interface WPTheme extends DefaultTheme {}

export type DirectionType = "rtl" | "ltr" | undefined;

const defaults: FormBuilderContextProviderValue = {
  config: {
    ssr: true,
  },
  locale: "en",
  translate: FallbackTranslate,
  dispatch: () => {},
};

export const FormBuilderContext = createContext<FormBuilderContextProviderValue>(
  defaults
);

const FormBuilderContextProvider: React.FC<FormBuilderContextProviderProps> = (
  props
) => {
  const { children, options } = props;

  const _model: FormBuilderContextModel = {
    ...defaults.config,
  };

  const reducer: Reducer<
    FormBuilderContextModel,
    FormBuilderContextReducerAction
  > = (state: FormBuilderContextModel) => {
    return state;
  };

  const [config, dispatch] = useReducer<
    Reducer<FormBuilderContextModel, FormBuilderContextReducerAction>
  >(reducer, _model);

  const theme = options?.theme ?? FormBuilderTheme;

  const renderGrommet = !options?.renderGrommet ? true : options!.renderGrommet;
  return (
    <FormBuilderContext.Provider
      value={{
        config,
        translate: options?.translator ?? FallbackTranslate,
        dispatch,
        locale: options?.locale || "en",
      }}
    >
      {renderGrommet ? (
        <Grommet theme={theme as any}>{children}</Grommet>
      ) : (
        children
      )}
    </FormBuilderContext.Provider>
  );
};

const useFormBuilderContext = () =>
  useContext<FormBuilderContextProviderValue>(FormBuilderContext);

export { FormBuilderContextProvider, useFormBuilderContext };
