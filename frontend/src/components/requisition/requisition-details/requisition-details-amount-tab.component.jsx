import React from "react";
import { useApolloClient } from "@apollo/client";

import { StyledRequisitionDetailsAmount } from "./styled-requisition-details";

import { GET_USER_CACHE_DETAILS } from "../../../graphql/queries/user.query";

const RequisitionDetailsAmountTab = ({
  label,
  info,
  amount,
  fee,
}) => {
  const client = useApolloClient();
  const { userRole } = client.readQuery({ query: GET_USER_CACHE_DETAILS });

  const { paymentSystem, currency } = info;

  return (
    <StyledRequisitionDetailsAmount>
      <div className="requisition-amount__label">
        {label}:
      </div>
      <div className="requisition-amount__value">
        <span
          className={`exchange-icon-${
            paymentSystem.tag === "CRYPTO" ? currency.asset : paymentSystem.tag
          } exchange-icon`}
        />
        <p>
          {amount} {currency.asset}
        </p>
      </div>
    </StyledRequisitionDetailsAmount>
  )
};

export default React.memo(RequisitionDetailsAmountTab);