import React from "react";
import Select, { Option } from "rc-select";

import { StyledSelect, StyledSelectLabel } from "../styles/styled-select";

const FilterActive = ({ name, value, handleChangeFilter }) => {
  return (
    <StyledSelect>
      <StyledSelectLabel>Activity</StyledSelectLabel>
      <Select
        className="custom-select"
        id={name}
        name={name}
        value={value ?? null}
        defaultValue={null}
        onChange={(value) => handleChangeFilter(name, value)}
      >
        <Option value={null}>
          <div className="option-select-item">All</div>
        </Option>
        <Option value={true}>
          <div className="option-select-item">Active</div>
        </Option>
        <Option value={false}>
          <div className="option-select-item">Not Active</div>
        </Option>
      </Select>
    </StyledSelect>
  );
};

export default React.memo(FilterActive);
