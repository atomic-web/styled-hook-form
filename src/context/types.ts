// export interface WPTheme extends DefaultTheme { };

import { Dispatch } from "react";
import { DeepMap } from "react-hook-form";
import { GHFContextReducerAction } from "./actions/types";

export type GHFContextModel = GHFOptions & DeepMap<any, any> & {
  ssr:boolean
};

export type TranslatorFunc = (
  str: string,
  values?: object & Record<any, any>
) => string;

export interface GHFContextReducer {
  (state: GHFContextModel, action: GHFContextReducerAction): GHFContextModel;
}

export interface GHFContextProviderValue {
  config: GHFContextModel;
  translate: TranslatorFunc;
  dispatch: Dispatch<GHFContextReducerAction>;
}

export interface GHFOptions {
  translator?: TranslatorFunc;
}

export interface GHFContextProviderProps {
  children: React.ReactChild;
  options?: GHFOptions;
}
 