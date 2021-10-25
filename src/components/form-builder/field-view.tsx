import { FieldViewProps } from "components";
import { useFormContext } from "react-hook-form";
import { renderField } from "./layouts/shared";
import { FC } from "react";
import { useInternalContext } from "./internal-context";

const FieldView: FC<FieldViewProps> = (props) => {
  const methods = useFormContext();
  const { formOptions, wrapComponent } = useInternalContext();
 
  let field = renderField(
    {...props},
    methods,
    wrapComponent ?? props.wrapComponent,
    props.shouldUnregister ?? formOptions?.shouldUnregister
  );

  return <> {field}</>;
};

export { FieldView };
