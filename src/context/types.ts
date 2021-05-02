// export interface WPTheme extends DefaultTheme { };

import { DeepMap } from "react-hook-form";

// export interface GHFContextProps {
//     children?: ReactNode,
//     options?: WPOptions
// }

// export interface WPOptions {
//     translator : (str :string,value? : object)=>string
// }

// export interface WPAction {
//     type: string,
//     payload: any
// }

export interface GHFContextModel extends DeepMap<any, any> {
  translator: (str: string, value?: object) => string;
}

export interface GHFContextProviderValue {
  model: GHFContextModel;
  translate: (str: string, value?: object) => string;
}

export interface GHFContextProviderProps {
    translator?: (str: string, value?: object) => string;
}
