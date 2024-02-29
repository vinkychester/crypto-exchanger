import React, { useContext } from "react";

import { RatesContext } from "./rates.component";
import { StyledCardInfoItem } from "../styles/styled-card";
import { StyledReserveWrapper } from "./styled-rates";
import { NavLink } from "react-router-dom";

const RatesReserve = () => {
  const { selected, reserve } = useContext(RatesContext);
  const { balance, currency: { asset } } = selected;
  const { inmin, inmax, outmin, outmax } = reserve;

  return (

    <StyledReserveWrapper>
      <div className="reserve-balance">
        <div className="reserve-balance__align">
          <div className="reserve-balance__bank">
            Available reserve: {(balance || 0).toFixed(2)} {asset}
          </div>
          <NavLink to="/contacts">Contact us if not enough reserve.</NavLink>
        </div>
      </div>
      <div className="reserve-content">
        <StyledCardInfoItem data-title="Purchase min">
          {inmin} {asset}
        </StyledCardInfoItem>
        <StyledCardInfoItem data-title="Purchase max">
          {inmax} {asset}
        </StyledCardInfoItem>
        <StyledCardInfoItem data-title="Sale min">
          {outmin} {asset}
        </StyledCardInfoItem>
        <StyledCardInfoItem data-title="Sale max">
          {outmax} {asset}
        </StyledCardInfoItem>
      </div>
    </StyledReserveWrapper>
  );
};

export default React.memo(RatesReserve);