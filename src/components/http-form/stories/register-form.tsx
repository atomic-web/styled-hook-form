import { FormField, FormFieldType } from "../../form-builder";
import { SHFContextProvider } from "../../../context";
import { Box, Text } from "grommet";
import { HttpForm } from "../http-form";
interface MyModel {
  username: string;
  email: string;
  password: string;
  agree: boolean;
}

export const LoginForm = () => {
  let fields: FormField[] = [
    {
      type: FormFieldType.Text,
      name: "username",
      label: "User Name",
      required: true,
      tip: "The unique name you will be using throught the system",
    },
    {
      type: FormFieldType.Text,
      name: "email",
      label: "Email",
      required: true,
      validationRules: {
        pattern: {
          //from https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
          value: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
          message: "Please Enter a valid email!",
        },
      },
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
    <SHFContextProvider>
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
            onError={(err) => {
              alert(JSON.stringify(err));
            }}
            onSuccess={(data) => {
              alert(JSON.stringify(data));
            }}
            mockResponse={(mock) => {
              mock.onPost("/api/user/signup").reply(() => {
                return new Promise((res) => {
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
            saveRequest={{
              url: "api/user/signup",
              method: "POST"
            }}
          ></HttpForm>
        </Box>
      </Box>
    </SHFContextProvider>
  );
};

export default {
  title: "HTTP Form/Login Form",
};
