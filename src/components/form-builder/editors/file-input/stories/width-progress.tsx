import { Meta } from "@storybook/react";
import {
  FormBuilderRef,
  FormField,
  FormFieldType,
} from "components/form-builder/types";
import { HttpForm } from "components/http-form";
import { Box, Button, Meter } from "grommet";
import { useRef, useState } from "react";

const sleep = (value: number) =>
  new Promise((resolve) => setTimeout(resolve, value));

export const WithProgress = () => {
  const filds: FormField[] = [
    {
      name: "file",
      label: "File",
      required:true,
      type: FormFieldType.File,
    },
  ];

  const [progress, setProgress] = useState<number>(0);

  const formRef = useRef<FormBuilderRef>(null);

  return (
    <Box justify="center" direction="row">
      <Box width="medium">
        <HttpForm
          ref={formRef}
          submitButton={false}
          request={{
            url: "/api/file",
            method: "POST",
            onUploadProgress: (p: any) => {
              /*
                For sake of simplicity, we directly pass the percentage from the
                mock handler. in a real-world scenario, you'll get ProgressEvent as
                an argument and you have to do some computation to get the progress
              */
              setProgress(p.progress);
            },
          }}
          fields={filds}
          mockResponse={(mock) => {
            //borrowed from this gist : https://gist.github.com/donaldpipowitch/f000f4d27d1b738ee05050af06e88eb0
            mock.onPost("/api/file").reply(async ({ onUploadProgress }) => {
              const total = 100;
              for (const progress of [0, 0.2, 0.4, 0.6, 0.8, 1]) {
                await sleep(500);
                if (onUploadProgress) {
                  onUploadProgress({ progress: total * progress, total });
                }
              }
              return [200, { success: true }];
            });
          }}
        >
          <Meter max={100} value={progress} margin={{ vertical: "medium" }} />
          <Button label="Upload" primary type="submit" />
        </HttpForm>
      </Box>
    </Box>
  );
};

export default {
  title: "Form Builder/Editors/File Input/With Progress",
} as Meta;
