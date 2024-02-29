import React, { useState, useContext, useCallback } from "react";
import { useMutation } from "@apollo/client";

import { StyledButton } from "../../styles/styled-button";

import { UPDATE_CREDIT_CARD_DATA } from "../../../graphql/mutations/credit-card.mutation";
import { CardVerificationDetailsContext } from "./card-verification-details.component";
import { parseApiErrors } from "../../../utils/response.util";
import { creditCardStatuses } from "../../../utils/consts.util";

const CardVerificationDetailsCancel = () => {
  const { id, cardMask, refetch } = useContext(CardVerificationDetailsContext);

  const [comment, setComment] = useState("");
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

  const handleChangeComment = useCallback(
    (value) => {
      setComment(value);
    },
    [comment]
  );

  const handleChangeStatus = () => {
    UpdateCreditCardData({
      variables: { id, comment, status: creditCardStatuses.CANCELED },
    });
  };

  return (
    <>
      <StyledButton color="danger" border type="button" onClick={handleChangeStatus}>
        Cancel
      </StyledButton>
       {/*<Comment
        comment={comment}
        errors={errors}
        handleChangeComment={handleChangeComment}
       />*/}
    </>
  );
};

const Comment = ({ comment, errors, handleChangeComment }) => {
  return (
    <>
      <p style={{ marginBottom: "15px" }}>
        Вы действительно хотите отменить верификацию карты?
      </p>
      <textarea
        name="comment"
        label="Примечание"
        placeholder="Текст примечания"
        handleChange={(event) => handleChangeComment(event.target.value)}
        value={comment}
        maxLength="6000"
        required
        errors={errors.comment}
      />
    </>
  );
};

export default React.memo(CardVerificationDetailsCancel);
