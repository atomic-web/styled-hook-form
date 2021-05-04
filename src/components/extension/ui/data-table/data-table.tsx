import { useGHFContext } from "context";
import { Box, DataTable as GrommetDataTable, Spinner, Text } from "grommet";
import { DataTableProps } from "./types";
import DataTableLoader from "./loader";
import React, { useCallback, useEffect } from "react";
import {
  DataTableContext,
  DataTableContextProvider,
  useDataTableContext,
} from "./data-context";
import useAxios from "axios-hooks";
import MockAdapter from "axios-mock-adapter";
import StaticAxios from "axios";

const DataTable: React.FC<DataTableProps> = (props) => {
  let { data, ...rest } = props;

  return (
    <Box>
      <DataTableContextProvider data={data}>
        <DataTableImpl data={data} {...rest} />
      </DataTableContextProvider>
    </Box>
  );
};

const DataTableImpl: React.FC<DataTableProps> = (props) => {
  let {
    request,
    mockResponse,
    ssr: perSsr,
    data,
    columns,
    onRequest,
    onResponse,
    onError,
    ...rest
  } = props;

  let {
    config: { ssr: globalSSR },
  } = useGHFContext();

  let { dispatch } = useDataTableContext();

  let ssrEnabled = perSsr !== undefined ? perSsr : globalSSR;

  if (typeof request === "string") {
    request = {
      url: request,
    };
  }

  request.transformRequest = useCallback(
    (data: any, headers: any) => {
      if (onRequest) return onRequest(data, headers);
      return data;
    },
    [onRequest]
  );

  request.transformResponse = useCallback(
    (data: any, headers: any) => {
      let _data = onResponse ? onResponse(data, headers) : data;
      dispatch({ type: "add", payload: _data });
    },
    [onResponse]
  );

  let [{ loading, error }] = useAxios(request, {
    ssr: ssrEnabled,
    manual: !ssrEnabled,
  });

  if (mockResponse) {
    let mock = new MockAdapter(StaticAxios);
    mockResponse(mock);
  }

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error]);

  return (
    <DataTableContext.Consumer>
      {({ state: { data } }) => (
        <Box> 
          {ssrEnabled && data && (
            <GrommetDataTable
              data={data}
              columns={columns}
            ></GrommetDataTable>
          )}
          {(!ssrEnabled || !data) && <DataTableLoader />}
        </Box>
      )}
    </DataTableContext.Consumer>
  );
};

export { DataTable };
