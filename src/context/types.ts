// export interface WPTheme extends DefaultTheme { };

import { Dispatch } from "react";
import { DeepMap } from "react-hook-form";
import { ThemType } from "../themes/base-theme";
import { FormBuilderContextReducerAction } from "./actions/types";

export type FormBuilderContextModel = FormBuilderOptions & DeepMap<any, any> & {
  ssr:boolean
};

export type TranslatorFunc = (
  str: string,
  values?: object & Record<any, any>
) => string;

export interface FormBuilderContextReducer {
  (state: FormBuilderContextModel, action: FormBuilderContextReducerAction): FormBuilderContextModel;
}

export interface FormBuilderContextProviderValue {
  config: FormBuilderContextModel;
  translate: TranslatorFunc;
  theme?: ThemType,
  locale : string,
  dispatch: Dispatch<FormBuilderContextReducerAction>;
}

export interface FormBuilderOptions {
  translator?: TranslatorFunc; 
  theme?: ThemType,
  renderGrommet : boolean,
  locale? : string
}

export interface FormBuilderContextProviderProps {
  children: React.ReactChild;
  options?: FormBuilderOptions;
}
 