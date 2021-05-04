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
import { usePagedData } from "components/utils/paged-data-source";

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

  let { error } = usePagedData({
    request,
    onRequest: (data: any, headers: any) => {
      return onRequest ? onRequest(data, headers) : data;
    },
    onResponse: (_data, page, headers) => {
      let cdata = onResponse ? onResponse(data, headers) : _data;
      dispatch({ type: "add", payload: cdata });
      return cdata;
    },
  });

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
              {...rest}
              paginate={{ numberItems: 100 }}
            ></GrommetDataTable>
          )}
          {(!ssrEnabled || !data) && <DataTableLoader />}
        </Box>
      )}
    </DataTableContext.Consumer>
  );
};

export { DataTable };
