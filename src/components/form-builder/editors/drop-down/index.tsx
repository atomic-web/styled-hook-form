import React, { Fragment, useMemo } from "react";
import { forwardRef, useCallback, useEffect, useState, memo } from "react";
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
  useWatch,
} from "react-hook-form";
import { DropDownProps, OptionProps, RemoteDataSource } from "./types";
import { Box, BoxProps, CheckBox, Select, Text } from "grommet";
import { FormField } from "../../types";
import { Spinner } from "grommet";
import { usePagedData } from "../../../utils/paged-data-source";
import { useSHFContext } from "../../../../context";
import styled from "styled-components";
// @ts-ignore
import { inputStyle } from "grommet/utils/styles";

const Option = memo((props: OptionProps) => {
  let { label, selected } = props;
  return (
    <Box direction="row" gap="small" align="center" pad="xsmall">
      <CheckBox tabIndex={-1} checked={selected} onChange={() => {}} />
      {label}
    </Box>
  );
});

const LabelBox = styled(Box).attrs({
  direction: "row",
})<{ plainLabel?: boolean }>`
  ${({ plainLabel }) => !plainLabel && inputStyle}
  border:none;
  display: flex;
  flex-direction: row;
  flex-wrap:wrap;
`;

const DefaultOptionLabel = ({ content }: { content: string }) => (
  <span> {content} </span>
);

const DropDown = forwardRef<HTMLButtonElement, FormField<DropDownProps>>(
  (props, ref) => {
    let vrules = props.validationRules || {};
    const { translate: T } = useSHFContext();

    let {
      name,
      label,
      options,
      methods,
      required,
      multiple,
      onSearch,
      itemLabelKey,
      itemValueKey,
      placeholder,
      labelWrap,
      renderItem,
      renderItemLabel,
      plainLabel,
      selectProps,
      defaultValue: initialValue,
    } = props;

    let [localValue, setLocalValue] = useState<any[] | null>(null);
    let [localOptions, setLocalOptions] = useState<any[]>([]);
    let [hasSelection, setHasSelection] = useState<boolean>(false);
    let [remoteOptions, setRemoteOptions] = useState<any[]>([]);
    let [remoteSearchKey, setRemoteSearchKey] = useState<string>("");

    let dataSourceOptions: RemoteDataSource | null = useMemo(() => {
      return (options as object).hasOwnProperty("request")
        ? ((options as unknown) as RemoteDataSource)
        : null;
    }, [options]);

    let { loading = false, nextPage = null, hasMore = null } = usePagedData({
      request: dataSourceOptions?.request ?? null,
      pageParamName: dataSourceOptions?.pageKey,
      pageSizeParamName: dataSourceOptions?.pageSizeKey,
      searchParamName: dataSourceOptions?.searchKey,
      searchParam: remoteSearchKey,
      listPropName:dataSourceOptions?.listKey,
      totalPropName:dataSourceOptions?.totalKey,
      params: dataSourceOptions?.extraParams,
      mockResponse: dataSourceOptions?.mockResponse,
      onResponse: (data: any[], page: number) => {
        if (dataSourceOptions?.onResponse){
          data = dataSourceOptions.onResponse(data);
        }else{
          if (!Array.isArray(data)){
            data = data[dataSourceOptions?.listKey ?? "list"];
          }
        }
        setRemoteOptions((oldOptions) => {
          let newOptions = [...(page > 1 ? oldOptions : []), ...data];
          let option = getOptionsByValue(newOptions, computedValue);
          setLocalValue(option);
          return newOptions;
        });
        return data;
      },
    });

    let control = methods?.control;

    if (required) {
      vrules.required = {
        value: required,
        message: T("required-msg", { name: label }),
      };
    }

    useEffect(() => {
      setLocalOptions(options instanceof Array ? options : []);
    }, [options]);

    let liveValue = useWatch({
      name: name,
      control: methods!.control,
      defaultValue: initialValue,
    });

    let actualOptions = useMemo(
      () => (dataSourceOptions ? remoteOptions ?? [] : localOptions),
      [dataSourceOptions, remoteOptions, localOptions]
    );

    const getOptionsByValue = (options: any[], value: any[] | any): any[] => {
      return options.filter((o) =>
        Array.isArray(value)
          ? value.some(
              (v) =>
                v === o[itemValueKey] || v[itemValueKey] === o[itemValueKey]
            )
          : value === o[itemValueKey] || value === o
      );
    };

    let computedValue = useMemo(() => {
      return getOptionsByValue(
        actualOptions,
        hasSelection ? localValue : liveValue ?? initialValue
      );
    }, [hasSelection, initialValue, liveValue, actualOptions]);

    useEffect(() => {
      if (actualOptions) {
        setLocalValue(computedValue);
      }
    }, [computedValue, actualOptions]);

    const handleSearch = (text: string) => {
      if (!dataSourceOptions && text.length === 0) {
        setLocalOptions(options instanceof Array ? options : []);
        return;
      }

      if (dataSourceOptions) {
        setRemoteSearchKey(text);
      } else {
        let filteredOptions: any[];
        if (onSearch) {
          filteredOptions = onSearch(text, localOptions);
        }

        const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");

        filteredOptions = localOptions.filter((o) =>
          (o[itemLabelKey] as string).match(new RegExp(escapedText, "gi"))
        );

        setLocalOptions(filteredOptions);
      }
    };

    const handleMore = () => {
      if (hasMore) {
        nextPage!();
      }
    };

    const selectDynamicProps: any = {};

    if (dataSourceOptions && loading) {
      selectDynamicProps.icon = <Spinner />;
    }

    const handleChange = useCallback(
      (field: ControllerRenderProps<FieldValues>) => (e: any) => {
        setLocalValue(e.value);
        field.onChange(
          multiple
            ? e.value.map((v: any) => v[itemValueKey])
            : e.value[itemValueKey]
        );
        setHasSelection(true);
      },
      []
    );

    let selectContent = multiple
      ? (option: any) => {
          let selectedValues = localValue;

          let opt_value = option[itemValueKey],
            opt_label = option[itemLabelKey];

          return (
            <Option
              label={
                renderItem ? (
                  renderItem(option)
                ) : (
                  <DefaultOptionLabel content={opt_label} />
                )
              }
              selected={
                selectedValues && Array.isArray(selectedValues)
                  ? selectedValues.findIndex(
                      (v) => v[itemValueKey] === opt_value
                    ) !== -1
                  : selectedValues === opt_value
              }
            />
          );
        }
      : null;

    const valueLabel = () => {
      let labels = (
        <LabelBox plainLabel={plainLabel}>
          {localValue && localValue.length ? (
            localValue.map((val: any, idx: number) => (
              <Fragment key={val[itemValueKey]}>
                {renderItemLabel ? (
                  renderItemLabel!(
                    val,
                    {
                      setValue: (
                        setter: (prev: any[] | any) => any[] | any
                      ) => {
                        let _value = setter(localValue);
                        methods!.setValue(name, _value);
                        setLocalValue(_value);
                      },
                    },
                    idx
                  )
                ) : (
                  <>
                    <Text children={val[itemLabelKey]} />
                    {localValue!.length - 1 > idx && <span>,</span>}
                  </>
                )}
              </Fragment>
            ))
          ) : (
            <Text>{placeholder ?? T("drop-down-plcaholder")}</Text>
          )}
        </LabelBox>
      );

      let wrapElement = labelWrap
        ? React.cloneElement(labelWrap, {}, labels)
        : React.createElement(
            Box,
            {
              direction: "row",
              overflow: "hidden",
              wrap: true,
            } as BoxProps,
            labels
          );

      return wrapElement;
    };

    return (
      <Controller
        name={name}
        defaultValue={initialValue}
        rules={vrules as any}
        control={control}
        render={({ field }) => (
          <>
            <Select
              {...selectProps}
              closeOnChange={!multiple}
              ref={ref as any}
              multiple={multiple}
              valueLabel={valueLabel()}
              options={actualOptions}
              labelKey={itemLabelKey}
              valueKey={itemValueKey}
              onSearch={handleSearch}
              onMore={handleMore}
              onChange={handleChange(field)}
              value={localValue ?? []}
              emptySearchMessage={T("drop-down-search-empty-msg")}
              {...selectDynamicProps}
              children={selectContent}
            />
          </>
        )}
      ></Controller>
    );
  }
);

export default DropDown;
