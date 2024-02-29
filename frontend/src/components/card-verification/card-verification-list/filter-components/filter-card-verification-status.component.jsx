import React from "react";
import Select, { Option } from "rc-select";

import { StyledSelect, StyledSelectLabel } from "../../../styles/styled-select";

import { creditCardStatuses } from "../../../../utils/consts.util";

const FilterCardVerificationStatus = ({ value, handleChangeFilter }) => {
  const name = "status";

  return (
    <StyledSelect>
      <StyledSelectLabel>Status</StyledSelectLabel>
      <Select
        className="custom-select"
        id={name}
        name={name}
        value={value ?? null}
        defaultValue={creditCardStatuses.NOT_VERIFIED}
        onChange={(value) => handleChangeFilter(name, value)}
      >
        <Option value={null}>
          <div className="option-select-item">All</div>
        </Option>
        <Option value={creditCardStatuses.VERIFIED}>
          <div className="option-select-item">{creditCardStatuses.VERIFIED}</div>
        </Option>
        <Option value={creditCardStatuses.NOT_VERIFIED}>
          <div className="option-select-item">{creditCardStatuses.NOT_VERIFIED}</div>
        </Option>
        <Option value={creditCardStatuses.CANCELED}>
          <div className="option-select-item">{creditCardStatuses.CANCELED}</div>
        </Option>
        <Option value={creditCardStatuses.PAST_DUE_DATE}>
          <div className="option-select-item">{creditCardStatuses.PAST_DUE_DATE}</div>
        </Option>
      </Select>
    </StyledSelect>
  );
};

export default React.memo(FilterCardVerificationStatus);