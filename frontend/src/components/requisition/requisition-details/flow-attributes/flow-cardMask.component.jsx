import React from "react";

import { StyledCardInfoItem } from "../../../styles/styled-card";

const CardMask = ({ value, userRole }) => {
  return (
    userRole !== "client" && (
      <StyledCardInfoItem data-title="Requisites" className="requisition-data">
        {value}
      </StyledCardInfoItem>
    )
  );
};

export default CardMask;
