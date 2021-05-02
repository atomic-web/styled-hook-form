import useAxios from "axios-hooks";
import { FormBuilder } from "../form-builder";
import React, { useEffect } from "react";
import { HttpFormProps } from "./types";
import { Button, Spinner } from "grommet";

const successCodes = [200,201,202];

const HttpForm: React.FC<HttpFormProps> = (props) => {
  let { fields, request, onSuccess, onError ,model , loadingIndicator} = props;

  let [{ loading, data, error, response  }, {}] = useAxios(request, {
    manual: true,
  });

  useEffect(() => {
    if (response?.status && successCodes.indexOf(response?.status) != -1) {
      onSuccess && onSuccess(data);
    }
  }, [data]);

  useEffect(() => {
    onError && onError(data);
  }, [error]);

  
  const handleSubmit = (data : any)=>{
       
  }

  return <FormBuilder fields={fields} onSubmit={handleSubmit} model={model}>

        <Button type="submit" icon={!loadingIndicator ? <Spinner/> : <></>}>
            
        </Button>
  </FormBuilder>;
};

export { HttpForm };
