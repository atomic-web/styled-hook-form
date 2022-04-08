import { FieldViewProps } from "./types";
import { useFormContext } from "react-hook-form";
import { renderField } from "./layouts/shared";
import { FC, useContext, useEffect } from "react";
import { useInternalContext } from "./internal-context";
import { InternalFormContext } from "../form/internal-form-context";

const FieldView: FC<FieldViewProps> = (props) => {
  const methods = useFormContext();
  const { formOptions, wrapComponent } = useInternalContext();
  const internalFormContext = useContext(InternalFormContext);
  const { name, onChange, defaultValue, submitTrigger } = props;

  useEffect(() => {
    // this would be true if this is a partial form
    if (internalFormContext) {
      if (submitTrigger) {
        internalFormContext.registerAutoSubmitField({
          name: name!,
          handler: () => 0,
          defaultValue: defaultValue,
        });
      }

      if (onChange) {
        internalFormContext.registerChangeHandler({
          name: name!,
          handler: onChange,
          defaultValue: defaultValue,
        });
      }
    }
  }, [internalFormContext, name, onChange, defaultValue, submitTrigger]);

  let field = renderField(
    { ...props },
    methods,
    wrapComponent ?? props.wrapComponent,
    props.shouldUnregister ?? formOptions?.shouldUnregister
  );

  return <> {field}</>;
};

export { FieldView };
