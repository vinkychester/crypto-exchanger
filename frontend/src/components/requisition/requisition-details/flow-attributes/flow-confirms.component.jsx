import React from "react";

import { StyledCardInfoItem } from "../../../styles/styled-card";

const Confirms = ({ value }) => {
  return (
    <StyledCardInfoItem data-title="Network confirmations" className="requisition-data">
      {value}
    </StyledCardInfoItem>
  );
};

export default Confirms;
