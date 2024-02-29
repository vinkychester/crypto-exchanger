import React from "react";

import { StyledCardInfoItem } from "../../../styles/styled-card";

const Amount = ({ value }) => {
  return (
    <StyledCardInfoItem data-title="Cryptocurrency amount" className="requisition-data">
      {value}
    </StyledCardInfoItem>
  );
};

export default Amount;
