import React, { useState } from "react";
import Select, { Option } from "rc-select";
import { useMutation, useQuery } from "@apollo/client";

import SelectSkeleton from "../../skeletons/skeleton-select";

import { StyledSelect, StyledSelectLabel } from "../../styles/styled-select";

import { GET_PAIR_UNIT_TABS } from "../../../graphql/queries/pair-unit-tab.query";
import { UPDATE_PAIR_UNIT_DETAILS } from "../../../graphql/mutations/pair-unit.mutation";

const PairUnitTab = ({ currentTab, pairUnitId }) => {
  const [selected, setSelected] = useState(currentTab ? currentTab.id : null);
  const { loading: queryLoading, data } = useQuery(GET_PAIR_UNIT_TABS);
  const [updatePairUnitTab, { loading: mutationLoading }] = useMutation(UPDATE_PAIR_UNIT_DETAILS);

  if (queryLoading) return <SelectSkeleton label="Calculator tab" optionWidth="45"/>;

  const { pairUnitTabs } = data;

  const handleChange = (value) => {
    setSelected(value);
    updatePairUnitTab({ variables: { id: pairUnitId, pairUnitTabs: value } });
  };

  return (
    <StyledSelect className="pair-unit-item__tabs">
      <StyledSelectLabel>
        Calculator tab:
      </StyledSelectLabel>
      <Select
        className="custom-select"
        defaultValue={selected}
        disabled={mutationLoading}
        onChange={handleChange}
        value={selected}
      >
        <Option value={null}>
          <div className="option-select-item">
            Not selected
          </div>
        </Option>
        {pairUnitTabs.map(({ id, name }) => (
          <Option key={id} value={id}>
            <div className="option-select-item">
              {name}
            </div>
          </Option>
        ))}
      </Select>
    </StyledSelect>
  );
};

export default PairUnitTab;