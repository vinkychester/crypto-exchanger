import React, { useState, useContext } from "react";
import { useMutation, useApolloClient } from "@apollo/client";

import { GET_USER_CACHE_DETAILS } from "../../../graphql/queries/user.query";
import { DELETE_CREDIT_CARD } from "../../../graphql/mutations/credit-card.mutation";

const CardVerificationDelete = ({ id, cardMask, refetch }) => {
  const client = useApolloClient();

  const { userId } = client.readQuery({ query: GET_USER_CACHE_DETAILS });
  const [visible, setVisible] = useState(false);

  const [DeleteCreditCard, { loading }] = useMutation(DELETE_CREDIT_CARD, {
    onCompleted: () => {
      setVisible(false);
      refetch({
        variables: {
          itemsPerPage: 50,
          page: 1,
          client_id: userId
        }
      })
      // closableNotificationWithClick("Банковская карта удалена", "success");
    },
  });

  const handleDeleteCreditCard = () => {
    DeleteCreditCard({ variables: { id } });
  };

  return (
    <>
      <button type="button" onClick={handleDeleteCreditCard}>Delete</button>
    </>
  )
};

export default React.memo(CardVerificationDelete);