import React, { useContext, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";

import DelayInputComponent from "../input-group/delay-input-group";
import CalculatorSkeletonInput from "./skeleton/calculator-skeleton-input";

import { StyledTabInputWrapper } from "./styled-calculator";

import { GET_CALCULATED_DETAILS_WITH_COMMISSION } from "../../graphql/queries/pair.query";
import { CalculatorContext, CalculatorFooterContext, CalculatorTabContext } from "./calculator.container";

const INITIAL_STATE = { min: 0, max: 0, constant: 0, asset: "" };

const CalculatorFooter = () => {
  const history = useHistory();

  const { pair, handleChangeRequisitionDetails } = useContext(CalculatorContext);
  const { direction } = useContext(CalculatorTabContext);
  const { amount, loading, handleChangeRequisitionAmount } = useContext(CalculatorFooterContext);

  const includePayment = "payment" === direction;
  const includePayout = "payout" === direction;

  const [calculatedDetails, setCalculatedDetails] = useState(INITIAL_STATE);

  const [GetCalcuatedDetails, { loading: queryLoading }] = useLazyQuery(GET_CALCULATED_DETAILS_WITH_COMMISSION, {
    onCompleted: ({ calculationQueryPair }) => {
      const { amount, min, max, fee, currency } = calculationQueryPair[direction];
      handleChangeRequisitionDetails(field, amount);
      setCalculatedDetails({ amount, min, max, constant: fee.constant, asset: currency.asset });
    }
  });

  useEffect(() => {
    GetCalcuatedDetails({
      variables: { id: pair, includePayment, includePayout }
    });
  }, [pair]);

  const handleChangeAmount = ({ target }) => {
    const { value } = target;
    handleChangeRequisitionAmount(value.trim(), direction);
  };

  const field = `${direction}Amount`;

  if (queryLoading) return <CalculatorSkeletonInput />;

  const { min, max, constant, asset } = calculatedDetails;
  const isLoadingAmount = loading | queryLoading;

  return (
    <StyledTabInputWrapper className="exchange-data">
      <div className="exchange-data__input" data-currency={isLoadingAmount ? null : asset}>
        <DelayInputComponent
          label={direction === "payment" ? "You send" : "Recipient gets"}
          id={`${direction}-amount`}
          type="text"
          name={`${direction}-amount`}
          value={isLoadingAmount ? "recount..." : amount === 0 ? "0" : amount}
          debounceTimeout={1000}
          handleChange={handleChangeAmount}
          disabled={isLoadingAmount}
        />
      </div>
      <div className="exchange-data__min-max">
        <p>
          Min.:{" "}
          <span id={`${direction}-exchange-min`}>
            {queryLoading ? "recount..." : min}
          </span> {asset}{" "}
          / Max.:{" "}
          <span id={`${direction}-exchange-max`}>
            {queryLoading ? "recount..." : max}
          </span> {asset}
        </p>
        <p>
          The transfer fee: {constant} {asset}, some banks may take extra transfer fee.
        </p>
      </div>
    </StyledTabInputWrapper>
  );
};

export default React.memo(CalculatorFooter);
