import React, { createContext, Reducer, useContext, useReducer } from "react";
import { DefaultTheme } from "styled-components";
import { FormBuilderTheme } from "../themes/base-theme";
import { Grommet } from "grommet";
import {
  SHFContextModel,
  SHFContextProviderProps,
  SHFContextProviderValue,
} from "./types";
import { translate as FallbackTranslate } from "./actions";
import { SHFContextReducerAction } from "./actions/types";

export interface WPTheme extends DefaultTheme {}

export type DirectionType = "rtl" | "ltr" | undefined;

const defaults: SHFContextProviderValue = {
  config: {
    ssr: true,
  },
  translate: FallbackTranslate,
  dispatch: () => {},
};

export const SHFContext = createContext<SHFContextProviderValue>(defaults);

const SHFContextProvider: React.FC<SHFContextProviderProps> = (props) => {
  const { children, options } = props;

  const _model: SHFContextModel = {
    ...defaults.config,
  };

  const reducer: Reducer<SHFContextModel, SHFContextReducerAction> = (
    state: SHFContextModel
  ) => {
    return state;
  };

  const [config, dispatch] = useReducer<
    Reducer<SHFContextModel, SHFContextReducerAction>
  >(reducer, _model);

  const theme = options?.theme ?? FormBuilderTheme;

  const renderGrommet = !options?.renderGrommet ? true : options!.renderGrommet;

  return (
    <SHFContext.Provider
      value={{
        config,
        translate: options?.translator ?? FallbackTranslate,
        dispatch,
      }}
    >
      {renderGrommet ? (
        <Grommet theme={theme as any} children={children} />
      ) : (
        children
      )}
    </SHFContext.Provider>
  );
};

const useSHFContext = () => useContext<SHFContextProviderValue>(SHFContext);

export { SHFContextProvider, useSHFContext };
