import { FormField, FormFieldType } from "components/form-builder";
import { GHFContextProvider } from "context";
import { Box, Text } from "grommet";
import { HttpForm } from "../http-form";

export const Default = () => {
  let fields: FormField[] = [
    {
      type: FormFieldType.Text,
      name: "username",
      label: "User Name",
      required: true,
      tip:"The unique name you will be using throught the system"
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
            request={{
              url: "api/user/signup",
            }}
            fields={fields}
            model={{}}
            submitButton={<Text> Register </Text>}
          ></HttpForm>
        </Box>
      </Box>
    </GHFContextProvider>
  );
};

export default {
  title: "Default",
};
