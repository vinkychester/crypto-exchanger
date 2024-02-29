import React from "react";
import Select, { Option } from "rc-select";
import { useQuery } from "@apollo/client";

import { StyledSelect, StyledSelectLabel } from "../../../styles/styled-select";

import { GET_PAIR_UNIT_TABS } from "../../../../graphql/queries/pair-unit-tab.query";

const FilterTabs = ({ name, value, handleChangeFilter }) => {
  const { loading, error, data } = useQuery(GET_PAIR_UNIT_TABS, {
    fetchPolicy: "network-only",
  });

  if (loading) return <span>loading</span>;
  if (error) return <span>Error</span>;
  if (!data) return <span>Not found.</span>;

  const { pairUnitTabs } = data;

  return (
    <StyledSelect>
      <StyledSelectLabel>Calculator item</StyledSelectLabel>
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
        {pairUnitTabs &&
          pairUnitTabs.map(({ id, name }) => (
            <Option key={id} value={name}>
              <div className="option-select-item">{name}</div>
            </Option>
          ))}
      </Select>
    </StyledSelect>
  );
};

export default React.memo(FilterTabs);
