import React, { createContext, ReactNode, Reducer, useContext, useReducer } from "react";
import { DefaultTheme } from "styled-components";
import { FormTheme } from "../themes/base-theme";
import { Grommet } from "grommet";
import {
  GHFContextModel,
  GHFContextProviderProps,    
  GHFContextProviderValue,
} from "./types";
import { translate as FallbackTranslate } from "./actions";
import { GHFContextReducerAction } from "./actions/types";

export interface WPTheme extends DefaultTheme {}

export type DirectionType = "rtl" | "ltr" | undefined;


const defaults: GHFContextProviderValue = {  
    config:{
      ssr: true
    },
    translate : FallbackTranslate,
    dispatch : ()=>{}
};

export const GHFContext = createContext<GHFContextProviderValue>(defaults);

const GHFContextProvider: React.FC<GHFContextProviderProps> = (props) => {
  const { children, options } = props;

  const _model: GHFContextModel = {
      ...defaults.config
  };

  const reducer : Reducer<GHFContextModel,GHFContextReducerAction> = (state: GHFContextModel, action: GHFContextReducerAction) => {
    return state;
  };

  const [config , dispatch] = useReducer<Reducer<GHFContextModel,GHFContextReducerAction>>(reducer, _model);

  const theme = FormTheme;

  return (
    <GHFContext.Provider value={{
        config,
        translate : options?.translator ?? FallbackTranslate ,
        dispatch
    }}>
      <Grommet theme={theme} children={children} />
    </GHFContext.Provider>
  );
};

const useGHFContext = ()=> useContext<GHFContextProviderValue>(GHFContext);

export { GHFContextProvider , useGHFContext};