import React, { useContext } from "react";
import Tooltip from "rc-tooltip";

import { StyledCardInfoItem, StyledCardWrapper } from "../styles/styled-card";
import { StyledCourseContainer, StyledDayChange, StyledNotAvailable, StyledRatesName } from "./styled-rates";

import { RatesContext } from "./rates.component";
import { findByParams } from "../../utils/pairUnits.util";

const RateItem = ({ currency, paymentSystem, array }) => {
  const { asset } = currency;
  const { name, tag } = paymentSystem;
  const { selected } = useContext(RatesContext);

  const payment = findByParams(array, asset, tag, "payment");
  const payout = findByParams(array, asset, tag, "payout");

  const dayChange = 0;

  return (
    <StyledCardWrapper className="rate-item">
      <StyledRatesName>
        <div className={`rate-item__icon exchange-icon-${tag === "CRYPTO" ? asset : tag}`} />
        <div className="rate-item__title">
          <b>{name}</b>
          <span>{asset}</span>
        </div>
      </StyledRatesName>
      <StyledCardInfoItem data-title="24H change" className="rate-item__info">
        <StyledDayChange color={dayChange > 0 ? "green" : dayChange < 0 ? "red" : null}>
        <span>
          {dayChange}%
        </span>
        </StyledDayChange>
      </StyledCardInfoItem>
      <StyledCardInfoItem data-title="Purchase" className="rate-item__info">
        {payment && payment.isRateExchange ? (
          <Tooltip
            placement="top"
            overlay={
              <span>
              Purchase 1 {asset} <br />
              Commission: {payment.fee.constant} {asset} <br />
              Сost price:{" "}
                <span className={payment.surcharge > 0 ? "green" : payment.surcharge < 0 ? "red" : "transparent"}>
                {payment.surcharge.toFixed(2)}%
              </span>
            </span>
            }
          >
            <StyledCourseContainer type="Purchase" className="course-container">
              <div className="course-container__amount">{payment.exchangeRate}</div>
              <div className="course-container__currency">{selected.currency.asset}</div>
              <div className="course-container__price">
              <span className={payment.surcharge > 0 ? "green" : payment.surcharge < 0 ? "red" : "transparent"}>
                {payment.surcharge.toFixed(2)}%
              </span>
              </div>
            </StyledCourseContainer>
          </Tooltip>
        ) : <StyledNotAvailable type="Purchase">Exchange not available</StyledNotAvailable>}
      </StyledCardInfoItem>
      <StyledCardInfoItem data-title="Sale" className="rate-item__info">
        {payout && payout.isRateExchange ? (
          <Tooltip
            placement="top"
            overlay={
              <span>
              Selling 1 {asset} <br />
              Commission: {payout.fee.constant} {asset} <br />
              Сost price:{" "}
                <span className={payout.surcharge > 0 ? "green" : payout.surcharge < 0 ? "red" : "transparent"}>
                {payout.surcharge.toFixed(2)}%
              </span>
            </span>
            }
          >
            <StyledCourseContainer type="Sale" className="course-container">
              <div className="course-container__amount">{payout.exchangeRate}</div>
              <div className="course-container__currency">{selected.currency.asset}</div>
              <div className="course-container__price">
              <span className={payout.surcharge > 0 ? "green" : payout.surcharge < 0 ? "red" : "transparent"}>
                {payout.surcharge.toFixed(2)}%
              </span>
              </div>
            </StyledCourseContainer>
          </Tooltip>
        ) : <StyledNotAvailable type="Sale">Exchange not available</StyledNotAvailable>}
      </StyledCardInfoItem>
    </StyledCardWrapper>
  );
};

export default React.memo(RateItem);
