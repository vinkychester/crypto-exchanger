import React from "react";
import { useMutation } from "@apollo/client";

import ActiveToggler from "../../active-toggler/active-toggler.component";
import PairDetail from "./pair-detail.component";

import { StyledCardInfoItem, StyledCardWrapper } from "../../styles/styled-card";
import { StyledButton } from "../../styles/styled-button";

import { UPDATE_PAIR_DETAILS } from "../../../graphql/mutations/pair.mutation";

const PairItem = ({
  id,
  isActive,
  payment,
  payout,
  percent
}) => {

  const [updatePairDetails, { loading, error }] = useMutation(UPDATE_PAIR_DETAILS);

  return (
    <StyledCardWrapper className="pair-item">
      {/*<input
        type="checkbox"
      />*/}

      <StyledCardInfoItem data-title="Payment" className="pair-part">
        <div
          className={`pair-part__icon exchange-icon-${
            payment.paymentSystem.tag === "CRYPTO"
              ? payment.currency.asset
              : payment.paymentSystem.tag
          }`}
        />
        <div className="pair-part__title">
          <b>{payment.paymentSystem.name}</b> {payment.currency.asset}
        </div>
        <span className="pair-part__description">({payout.currency.service.tag})</span>
      </StyledCardInfoItem>
      <StyledCardInfoItem data-title="Payout" className="pair-part">
        <div
          className={`pair-part__icon exchange-icon-${
            payout.paymentSystem.tag === "CRYPTO"
              ? payout.currency.asset
              : payout.paymentSystem.tag
          }`}
        />
        <div className="pair-part__title">
          <b>{payout.paymentSystem.name}</b> {payout.currency.asset}
        </div>
        <span className="pair-part__description">({payout.currency.service.tag})</span>
      </StyledCardInfoItem>
      <ActiveToggler
        label="Activity"
        id={id}
        name="isActive"
        value={isActive}
        text="You really want to change the activity of the pair?"
        action={updatePairDetails}
        loading={loading}
        error={error}
      />
      <PairDetail
        id={id}
        name="percent"
        field={percent}
        regex={/^[+-]?([0-9]*[.])?[0-9]+/g}
        successMessage="Percent changed successfully"
        errorMessage="The value must not contain characters"
      />
      <StyledButton color="danger" border>
        Delete pair
      </StyledButton>
    </StyledCardWrapper>
  );
};

export default PairItem;