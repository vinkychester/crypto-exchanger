import React, { useState } from "react";
import { useMutation } from "@apollo/client";

import { parseApiErrors } from "../../../utils/response.util";
import ActiveToggler from "../../active-toggler/active-toggler.component";
import PairUnitFee from "./pair-unit-fee.component";
import PairUnitTab from "./pair-unit-tab.component";

import { StyledCardInfoItem, StyledCardRow, StyledCardWrapper } from "../../styles/styled-card";

import { UPDATE_PAIR_UNIT_DETAILS } from "../../../graphql/mutations/pair-unit.mutation";
import { GET_PAIR_UNITS_LIST } from "../../../graphql/queries/pair-unit.query";

const PairUnitItem = ({
  id,
  isActive,
  balance,
  priority,
  paymentSystem,
  currency,
  direction,
  fee,
  pairUnitTabs,
  isCardVerification,
  price
}) => {
  const [errors, setErrors] = useState([]);
  const [updatePairUnitDetails, { loading, error }] = useMutation(UPDATE_PAIR_UNIT_DETAILS, {
    refetchQueries: [
      {
        query: GET_PAIR_UNITS_LIST
      }
    ],
    onError: ({ graphQLErrors }) => setErrors([parseApiErrors(graphQLErrors)])
  });

  return (
    <StyledCardWrapper className="pair-unit-item">
      <div className="pair-unit-item__head">
        <div className="pair-unit-item__title">
          <b>
            {paymentSystem.name}
          </b>
          {currency.asset}
          <span>
            ({currency.service.tag})
          </span>
        </div>
        <div className="pair-unit-item__activity">
          <ActiveToggler
            title="Activity"
            id={id}
            name="isActive"
            value={isActive}
            text="You really want to change the activity of the payment system?"
            action={updatePairUnitDetails}
            loading={loading}
            error={error}
          />
        </div>
      </div>

      <div className="pair-unit-item__body">
        <StyledCardRow col="6" className="pair-unit-item__content">
          <StyledCardInfoItem data-title="Balance">
            {balance || "0"}
          </StyledCardInfoItem>
          <StyledCardInfoItem data-title="Type">
            {direction}
          </StyledCardInfoItem>
          <StyledCardInfoItem data-title={`Min, ${currency.asset}`}>
            {fee.min}
          </StyledCardInfoItem>
          <StyledCardInfoItem data-title={`Max, ${currency.asset}`}>
            {fee.max}
          </StyledCardInfoItem>
          <StyledCardInfoItem data-title="Percent">
            {fee.percent}
          </StyledCardInfoItem>
          <StyledCardInfoItem data-title="Constant">
            {fee.constant}
          </StyledCardInfoItem>
          <PairUnitFee
            className="pair-unit-item__price"
            id={id}
            name="price"
            field={price}
            regex={/^[+-]?([0-9]*[.])?[0-9]+/g}
            successMessage="Cost changed successfully"
            errorMessage="The value must not contain characters"
          />
          <PairUnitFee
            className="pair-unit-item__priority"
            id={id}
            name="priority"
            field={priority}
            regex={/^[+-]?([0-9]*[.])?[0-9]+/g}
            successMessage="Cost changed successfully"
            errorMessage="The value must not contain characters"
          />
          <PairUnitTab currentTab={pairUnitTabs} pairUnitId={id} />
          {direction === "payment" && currency.tag === "CURRENCY" && (
            <ActiveToggler
              className="pair-unit-item__verification"
              label="Card verification"
              id={id}
              name="isCardVerification"
              value={isCardVerification}
              text="You really want to change the card verification activity?"
              action={updatePairUnitDetails}
              loading={loading}
              error={error}
            />
          )}
        </StyledCardRow>
      </div>
    </StyledCardWrapper>
  );

};

export default PairUnitItem;