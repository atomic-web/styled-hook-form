import React, {  } from "react";
import { FormProps } from "./types";

const Form: React.FC<FormProps> = () => {
 


  return null;
};

Form.defaultProps = {
  autoSubmit: false,
  autoSubmitFields: [],
  submitTreshould: 500,
};

export { Form as default };
