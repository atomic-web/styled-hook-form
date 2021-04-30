import "styled-components";
import styledImport, { CSSProp, css as cssImport } from "styled-components";
import { DirectionType } from "../context";
import { ThemeType } from "grommet";
import React from "react";

// extend them!
declare module "styled-components" {
  export interface DefaultTheme extends ThemeType {
    validation?: {
      error?: {
        color: string;
      };
    };
  }
}

// Allow the 'as' prop for styled-components
declare global {
  namespace JSX {
    interface IntrinsicAttributes<T> extends DOMAttributes<T> {
      as?: string | React.ReactNode;
    }
  }
}

// Allow interpolation: css`${MyStyledComponent}:hover & { //... }`
type Interpolation = ObjectInterpolation<undefined>;

declare module "react" {
  // The css prop
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    css?: CSSProp | Interpolation;
  }
  // The inline svg css prop
  interface SVGProps<T> extends SVGProps<SVGSVGElement> {
    css?: CSSProp | Interpolation;
  }
}
