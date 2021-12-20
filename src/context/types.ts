// export interface WPTheme extends DefaultTheme { };

import { Dispatch } from "react";
import { DeepMap } from "react-hook-form";
import { ThemType } from "../themes/base-theme";
import { SHFContextReducerAction } from "./actions/types";

export type SHFContextModel = SHFOptions & DeepMap<any, any> & {
  ssr:boolean
};

export type TranslatorFunc = (
  str: string,
  values?: object & Record<any, any>
) => string;

export interface SHFContextReducer {
  (state: SHFContextModel, action: SHFContextReducerAction): SHFContextModel;
}

export interface SHFContextProviderValue {
  config: SHFContextModel;
  translate: TranslatorFunc;
  theme?: ThemType,
  locale : string,
  dispatch: Dispatch<SHFContextReducerAction>;
}

export interface SHFOptions {
  translator?: TranslatorFunc; 
  theme?: ThemType,
  renderGrommet : boolean,
  locale? : string
}

export interface SHFContextProviderProps {
  children: React.ReactChild;
  options?: SHFOptions;
}
 