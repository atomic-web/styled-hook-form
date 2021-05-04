import { FormField, FormFieldType } from "components/form-builder";
import { GHFContextProvider } from "context";
import { Box, Text } from "grommet";
import { resolve } from "node:path";
import React from "react";
import { HttpForm } from "../http-form";
interface MyModel {
  username: string;
  email: string;
  password: string;
  agree: boolean;
}

export const Default = () => {
  let fields: FormField[] = [
    {
      type: FormFieldType.Text,
      name: "username",
      label: "User Name",
      required: true,
      tip: "The unique name you will be using throught the system",
      render: (base: React.ReactNode, { watch }) => {
        return <div>{base}</div>;
      },
    },
    {
      type: FormFieldType.Text,
      name: "email",
      label: "Email",
      required: true,
      inputProps: {
        autoComplete: "Off",
      },
    },
    {
      type: FormFieldType.Password,
      name: "password",
      label: "Password",
      showPasswordStrength: true,
      required: true,
      inputProps: {
        autoComplete: "Off",
      },
    },
    {
      type: FormFieldType.Boolean,
      name: "agree",
      label: "Agree With Terms",
      required: true,
      controlType: "checkbox",
    },
  ];

  
  return (
    <GHFContextProvider>
      <Box align="center">
        <Box
          width="25em"
          background="light-2"
          pad="medium"
          round="small"
          border="all"
        >
          <HttpForm
            fields={fields}
            beforeSubmit={(data: MyModel) => data.agree}
            submitButton={<Text> Register </Text>}
            onError={(err)=>{
              alert(JSON.stringify(err));
            }}
            onSuccess={(data) => {
             alert(JSON.stringify(data));
            }}
            mockResponse={(mock) => {
              mock
              .onPost("/api/user/signup").networkErrorOnce()
              .onPost("/api/user/signup").reply(() => {
                return new Promise((res, rej) => {
                  setTimeout(() => {
                    res([
                      200,
                      {
                        success: true,
                      },
                    ]);
                  }, 1000);
                });
              });
            }}
            request={{
              url: "api/user/signup",
              method: "POST",
            }}
          ></HttpForm>
        </Box>
      </Box>
    </GHFContextProvider>
  );
};

export default {
  title: "Register From",
};
