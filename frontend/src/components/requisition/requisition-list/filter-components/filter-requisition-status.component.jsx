import React from "react";
import { useApolloClient } from "@apollo/client";
import Select, { Option } from "rc-select";

import { StyledSelect, StyledSelectLabel } from "../../../styles/styled-select";

import { GET_USER_CACHE_DETAILS } from "../../../../graphql/queries/user.query";
import { requisitionStatusConst } from "../../../../utils/consts.util";

const FilterRequisitionStatus = ({ value, handleChangeFilter }) => {
  const client = useApolloClient();
  const name = "status";
  const style = {
    textTransform: "inherit",
  };

  const { userRole } = client.readQuery({ query: GET_USER_CACHE_DETAILS });

  return (
    <StyledSelect>
      <StyledSelectLabel>Status</StyledSelectLabel>
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
        <Option value={requisitionStatusConst.NEW}>
          <div className="option-select-item">{requisitionStatusConst.NEW}</div>
        </Option>
        {/*<Option value={requisitionStatusConst.PROCESSING}>*/}
        {/*  <div className="option-select-item">*/}
        {/*    {requisitionStatusConst.PROCESSING}*/}
        {/*  </div>*/}
        {/*</Option>*/}
        <Option value={requisitionStatusConst.PROCESSED}>
          <div className="option-select-item">
            {requisitionStatusConst.PROCESSED}
          </div>
        </Option>
        <Option value={requisitionStatusConst.CARD_VERIFICATION}>
          <div className="option-select-item">
            {requisitionStatusConst.CARD_VERIFICATION}
          </div>
        </Option>
        <Option value={requisitionStatusConst.FINISHED}>
          <div className="option-select-item">
            {requisitionStatusConst.FINISHED}
          </div>
        </Option>
        <Option value={requisitionStatusConst.CANCELED}>
          <div className="option-select-item">
            {requisitionStatusConst.CANCELED}
          </div>
        </Option>
        <Option value={requisitionStatusConst.DISABLED}>
          <div className="option-select-item">
            {requisitionStatusConst.DISABLED}
          </div>
        </Option>
        <Option value={requisitionStatusConst.ERROR}>
          <div className="option-select-item">
            {requisitionStatusConst.ERROR}
          </div>
        </Option>
      </Select>
    </StyledSelect>
  );
};

export default React.memo(FilterRequisitionStatus);
