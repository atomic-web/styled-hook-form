import React, { Fragment, useMemo } from "react";
import { forwardRef, useCallback, useEffect, useState, memo } from "react";
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
  useWatch,
} from "react-hook-form";
import { DropDownProps, OptionProps, RemoteDataSource } from "./types";
import { Box, BoxProps, Button, CheckBox, Select, Text } from "grommet";
import { FormField } from "../../types";
import { Spinner } from "grommet";
import { usePagedData } from "../../../utils/paged-data-source";
import { useGHFContext } from "../../../../context";

const Option = memo((props: OptionProps) => {
  let { label, selected } = props;
  return (
    <Box direction="row" gap="small" align="center" pad="xsmall">
      <CheckBox tabIndex={-1} checked={selected} onChange={() => {}} />
      {label}
    </Box>
  );
});

const DefaultOptionLabel = ({ content }: { content: string }) => (
  <span> {content} </span>
);

const DropDown = forwardRef<HTMLButtonElement, FormField<DropDownProps>>(
  (props, ref) => {
    let vrules = props.validationRules || {};
    const { translate: T } = useGHFContext();

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
      defaultValue: initialValue,
    } = props;

    let [localValue, setLocalValue] = useState<any[] | null>(null);
    let [localOptions, setLocalOptions] = useState<any[]>([]);
    let [hasSelection, setHasSelection] = useState<boolean>(false);
    let [remoteOptions, setRemoteOptions] = useState<any[]>([]);
    let [remoteSearchKey, setRemoteSearchKey] = useState<string>("");

    let dataSourceOptions: RemoteDataSource | null = (options as object).hasOwnProperty(
      "url"
    )
      ? ((options as unknown) as RemoteDataSource)
      : null;

    let {
      loading = false,
      nextPage = null,
      hasMore = null
    } = !dataSourceOptions
      ? {}
      : usePagedData({
          request: dataSourceOptions.url ?? "",
          pageParamName: dataSourceOptions.pageKey,
          pageSizeParamName: dataSourceOptions.pageSizeKey,
          searchParamName: dataSourceOptions.searchKey,
          searchParam: remoteSearchKey,
          params:dataSourceOptions.extraParams,
          mockResponse: dataSourceOptions.mockResponse,
          onResponse: (data: any[], page: number) => {
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
          return (
            <Option
              label={
                renderItem ? (
                  renderItem(option)
                ) : (
                  <DefaultOptionLabel content={option[itemLabelKey]} />
                )
              }
              selected={
                selectedValues && Array.isArray(selectedValues)
                  ? selectedValues.findIndex(
                      (v) => v[itemValueKey] === option[itemValueKey]
                    ) !== -1
                  : selectedValues === option[itemValueKey]
              }
            />
          );
        }
      : null;

    const valueLabel = () => {
      let labels =
        localValue && localValue.length ? (
          localValue.map((val: any, idx: number) => (
            <Fragment key={val[itemValueKey]}>
              {renderItemLabel ? (
                renderItemLabel!(
                  val,
                  {
                    setValue: (setter: (prev: any[] | any) => any[] | any) => {
                      debugger
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
        );

      let wrapElement = labelWrap
        ? React.cloneElement(labelWrap, {}, labels)
        : React.createElement(
            Box,
            {
              direction: "row",
              overflow: "hidden",
              pad: "xsmall",
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
