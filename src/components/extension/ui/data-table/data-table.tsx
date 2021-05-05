import { useGHFContext } from "context";
import {
  Box,
  DataTable as GrommetDataTable,
  Pagination,
  Spinner,
  Text,
} from "grommet";
import { DataTableProps } from "./types";
import DataTableLoader from "./loader";
import React, { useEffect, useState } from "react";
import {
  DataTableContext,
  DataTableContextProvider,
  useDataTableContext,
} from "./data-context";
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
    onRequestError,
    paginate,
    ...rest
  } = props;

  let [currentPage, setCurrentPage] = useState<number>(0);

  let {
    config: { ssr: globalSSR },
  } = useGHFContext();

  let { dispatch } = useDataTableContext();

  let ssrEnabled = perSsr !== undefined ? perSsr : globalSSR;

  let { error, data: ServerData } = usePagedData({
    request,
    onRequest: (data: any, headers: any) => {
      return onRequest ? onRequest(data, headers) : data;
    },
    onResponse: (_data, _, headers) => {
      let cdata = onResponse ? onResponse(data, headers) : _data;
      return cdata;
    },
    mockResponse,
    page: currentPage,
  });

  useEffect(() => {
    if (error && onRequestError) {
      onRequestError(error);
    }
  }, [error]);

  useEffect(() => {
    if (ServerData) {
      dispatch({ type: "set", payload: ServerData.list });
    }
  }, [ServerData]);

  return (
    <DataTableContext.Consumer>
      {({ state: { data } }) => (
        <Box>
          {ssrEnabled && data && (
            <Box>
              <GrommetDataTable
                {...rest}
                columns={columns}
                data={data}
                paginate={false}
              ></GrommetDataTable>
              <Pagination                
                onChange={(e) => {
                  setCurrentPage(e.page);
                }}
                {...paginate}
              />
            </Box>
          )}
          {(!ssrEnabled || !data) && <DataTableLoader />}
        </Box>
      )}
    </DataTableContext.Consumer>
  );
};

export { DataTable };
