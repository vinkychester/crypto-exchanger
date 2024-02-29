import React from "react";
import Select, { Option } from "rc-select";

import { StyledSelect, StyledSelectLabel } from "../../styles/styled-select";

const PairUnitSelect = ({
  label,
  direction,
  selected,
  collection,
  handleChangeSelect
}) => {

  return (
    <StyledSelect>
      <StyledSelectLabel>{label}</StyledSelectLabel>
      <Select
        className="custom-multiselect"
        mode="tags"
        value={selected}
        onChange={(value) => handleChangeSelect(direction, value)}
      >
        {collection && collection.map(({ id, currency, paymentSystem }) => (
          <Option key={id} value={id}>
            <div className="option-select-item">
              <b>{paymentSystem.name}</b> {currency.asset} ({currency.service.tag})
            </div>
          </Option>
        ))}
      </Select>
    </StyledSelect>
  );
};

export default React.memo(PairUnitSelect);