import React, { createContext, Reducer, useContext, useReducer } from "react";
import { DefaultTheme } from "styled-components";
import { FormTheme } from "../themes/base-theme";
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
    config:{
      ssr: true
    },
    translate : FallbackTranslate,
    dispatch : ()=>{}
};

export const FormBuilderContext = createContext<FormBuilderContextProviderValue>(defaults);

const FormBuilderContextProvider: React.FC<FormBuilderContextProviderProps> = (props) => {
  const { children, options } = props;

  const _model: FormBuilderContextModel = {
      ...defaults.config
  };

  const reducer : Reducer<FormBuilderContextModel,FormBuilderContextReducerAction> = (state: FormBuilderContextModel) => {
    return state;
  };

  const [config , dispatch] = useReducer<Reducer<FormBuilderContextModel,FormBuilderContextReducerAction>>(reducer, _model);

  const theme = FormTheme;

  return (
    <FormBuilderContext.Provider value={{
        config,
        translate : options?.translator ?? FallbackTranslate ,
        dispatch
    }}>
      <Grommet theme={theme} children={children} />
    </FormBuilderContext.Provider>
  );
};

const useFormBuilderContext = ()=> useContext<FormBuilderContextProviderValue>(FormBuilderContext);

export { FormBuilderContextProvider , useFormBuilderContext};