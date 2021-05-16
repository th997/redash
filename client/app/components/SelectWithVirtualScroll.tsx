import React, { useMemo } from "react";
import { maxBy } from "lodash";
import AntdSelect, { SelectProps, LabeledValue } from "antd/lib/select";
import { calculateTextWidth } from "@/lib/calculateTextWidth";
import TreeSelect from "antd/lib/tree-select";
import "antd/dist/antd.css";
import { useState } from "react";

const MIN_LEN_FOR_VIRTUAL_SCROLL = 400;

interface VirtualScrollLabeledValue extends LabeledValue {
  label: string;
}

interface VirtualScrollSelectProps extends Omit<SelectProps<string>, "optionFilterProp" | "children"> {
  options: Array<VirtualScrollLabeledValue>;
}
function SelectWithVirtualScroll({ options, ...props }: VirtualScrollSelectProps): JSX.Element {
  const dropdownMatchSelectWidth = useMemo<number | boolean>(() => {
    if (options && options.length > MIN_LEN_FOR_VIRTUAL_SCROLL) {
      const largestOpt = maxBy(options, "title.length");

      if (largestOpt) {
        const offset = 40;
        const optionText = largestOpt.label;
        const width = calculateTextWidth(optionText);
        if (width) {
          return width + offset;
        }
      }

      return true;
    }

    return false;
  }, [options]);
  // add "Select All"
  // https://ant.design/components/tree-select/
  // https://codesandbox.io/s/ant-design-tree-select-select-all-forked-gpk8b?file=/index.js
  const values = options.map(item => ({ title: item.label, value: item.value, key: item.value }))
  const allIds = options.map(item => item.value);
  const [selectedValues, setSelectedValues] = useState([]);
  console.log("props:" + props)
  return (
    // <AntdSelect<string>
    //   dropdownMatchSelectWidth={dropdownMatchSelectWidth}
    //   options={options}
    //   optionFilterProp="label" // as this component expects "options" prop
    //   {...props}
    // />
    <TreeSelect
      dropdownMatchSelectWidth={dropdownMatchSelectWidth}
      allowClear={true}
      treeCheckable={true}
      showCheckedStrategy={TreeSelect.SHOW_CHILD}
      treeData={[
        {
          title:
            selectedValues.length > 0 ? (
              <span
                onClick={() => { setSelectedValues([]); props.onChange([]) }}
                style={{ display: "inline-block", color: "#286FBE", cursor: "pointer" }}
              >Unselect all</span>
            ) : (
              <span
                onClick={() => { setSelectedValues(allIds); props.onChange(allIds) }}
                style={{ display: "inline-block", color: "#286FBE", cursor: "pointer" }}
              >Select all</span>
            ),
          key: "__all",
          value: "__all",
          disableCheckbox: true,
          disabled: true
        }, ...values
      ]
      }
      {...props}
    />
  );
}

export default SelectWithVirtualScroll;
