import React from "react";
import Select, { Option } from "rc-select";

const FilterPublish = ({ name, value, handleChangeFilter }) => {
  return (
    <>
      <label>Publication</label>
      <Select
        name={name}
        value={value ?? null}
        defaultValue={null}
        onChange={(value) => handleChangeFilter(name, value)}
      >
        <Option value={null}>All</Option>
        <Option value={true}>Published</Option>
        <Option value={false}>Unpublished</Option>
      </Select>
    </>
  );
};

export default React.memo(FilterPublish);
