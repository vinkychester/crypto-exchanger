import React from "react";
import Select, { Option } from "rc-select";
import Tooltip from "rc-tooltip";

import { StyledSelect } from "../styles/styled-select";

const FilterItemsPerPage = ({ value, user, handleChangeFilter, name }) => {
  const items = user ? [12, 20, 36, 60, 100] : [10, 20, 30, 50, 100];

  return (
    <StyledSelect width="85">
      <Tooltip placement="top" overlay="Count of items per page">
        <Select
          className="custom-select"
          name={name}
          value={value ? value : 50}
          onChange={(value) => handleChangeFilter(name, value)}
        >
          {items.map((item) => (
            <Option value={item} key={item}>
              <div className="option-select-item">{item}</div>
            </Option>
          ))}
        </Select>
      </Tooltip>
    </StyledSelect>
  );
};

export default React.memo(FilterItemsPerPage);
