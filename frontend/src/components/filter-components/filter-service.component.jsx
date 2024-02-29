import React from "react";
import Select, { Option } from "rc-select";
import { useQuery } from "@apollo/client";

import { StyledSelect, StyledSelectLabel } from "../styles/styled-select";

import { GET_SERVICES } from "../../graphql/queries/service.query";

const FilterService = ({ name, value, handleChangeFilter, label }) => {
  const { data, error, loading } = useQuery(GET_SERVICES, {
    fetchPolicy: "network-only",
  });

  if (loading) return <span>loading</span>;
  if (error) return <span>Error</span>;
  if (!data) return <span>Not found.</span>;

  const { services } = data;

  return (
    <StyledSelect>
      <StyledSelectLabel htmlFor={name}>{label}</StyledSelectLabel>
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
        {services &&
          services.map(({ id, name }) => (
            <Option key={id} value={name}>
              <div className="option-select-item">{name}</div>
            </Option>
          ))}
      </Select>
    </StyledSelect>
  );
};

export default React.memo(FilterService);
