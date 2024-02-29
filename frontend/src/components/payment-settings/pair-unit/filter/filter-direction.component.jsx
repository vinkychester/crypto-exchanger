import React from "react";
import Select, { Option } from "rc-select";

import { StyledSelect, StyledSelectLabel } from "../../../styles/styled-select";

const FilterDirection = ({ name, value, handleChangeFilter }) => {
  return (
    <StyledSelect>
      <StyledSelectLabel htmlFor={name}>Direction</StyledSelectLabel>
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
        <Option value="payment">
          <div className="option-select-item">Payment</div>
        </Option>
        <Option value="payout">
          <div className="option-select-item">Payout</div>
        </Option>
      </Select>
    </StyledSelect>
  );
};

export default React.memo(FilterDirection);
