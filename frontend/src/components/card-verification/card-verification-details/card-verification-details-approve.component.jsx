import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/client";

import { StyledButton } from "../../styles/styled-button";

import { UPDATE_CREDIT_CARD_DATA } from "../../../graphql/mutations/credit-card.mutation";
import { CardVerificationDetailsContext } from "./card-verification-details.component";
import { creditCardStatuses } from "../../../utils/consts.util";
import { parseApiErrors } from "../../../utils/response.util";

const CardVerificationDetailsApprove = () => {
  const { id, cardMask, refetch } = useContext(CardVerificationDetailsContext);

  const [errors, setErrors] = useState("");

  const [UpdateCreditCardData, { loading }] = useMutation(
    UPDATE_CREDIT_CARD_DATA,
    {
      onCompleted: () => {
        // setVisible(false)
        refetch({ variables: { id } });
      },
      onError: ({ graphQLErrors }) => setErrors(parseApiErrors(graphQLErrors)),
    }
  );

  const handleChangeStatus = () => {
    UpdateCreditCardData({
      variables: { id, status: creditCardStatuses.VERIFIED },
    });
  };

  return (
      <StyledButton color="success" type="button" onClick={handleChangeStatus}>Approve</StyledButton>
  )
};

export default React.memo(CardVerificationDetailsApprove);