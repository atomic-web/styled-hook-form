import "styled-components";
import { CSSProp } from "styled-components";
import { ThemeType } from "../themes";
import React from "react";



// extend them!
declare module "styled-components" {
  export interface DefaultTheme extends ThemeType {
    dir? : "rtl" | undefined,
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
  interface SVGProps extends SVGProps<SVGSVGElement> {
    css?: CSSProp | Interpolation;
  }
}
