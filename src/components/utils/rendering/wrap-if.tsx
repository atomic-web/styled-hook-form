import React from "react";
import { WrapIfProps } from "./types";

const WrapIf: React.FC<WrapIfProps> = ({iff, children} : WrapIfProps) => (<>
      {
          iff ? children : (children as unknown as any).props.children
      }
  </>
);

export { WrapIf };
