import React from "react";
import { useQuery, useApolloClient } from "@apollo/client";

import Can from "../../components/can/can.component";
import CardVerificationDetails from "../../components/card-verification/card-verification-details/card-verification-details.component";
import AlertMessage from "../../components/alert/alert.component";

import { GET_USER_CACHE_DETAILS } from "../../graphql/queries/user.query";
import { GET_CREDIT_CARD_DETAILS } from "../../graphql/queries/credit-card.query";
import { cardVerification } from "../../rbac-consts";
import { parseUuidIRI } from "../../utils/response.util";

const CardVerificationDetailsPage = ({ match }) => {
  const clientApollo = useApolloClient();
  const { id } = match.params;

  const { userId, userRole } = clientApollo.readQuery({
    query: GET_USER_CACHE_DETAILS,
  });

  const { loading, error, data, refetch } = useQuery(GET_CREDIT_CARD_DETAILS, {
    variables: { id: `/api/credit_cards/${id}` },
    fetchPolicy: "network-only",
  });

  if (loading) return "loading...";
  if (error) return "error";
  if (!data) return "Not found";

  const { client, ...props } = data.creditCard;

  let permissions = {};

  if ("client" === userRole)
    permissions = { userId, ownerId: parseUuidIRI(client.id) };

  return (
    <Can
      role={userRole}
      perform={cardVerification.READ_DETAILS}
      data={permissions}
      yes={() => <CardVerificationDetails client={client} refetch={refetch} {...props} />}
      no={() => <AlertMessage center margin="50px auto" type="error" message="Access denied" />}
    />
  );
};

export default React.memo(CardVerificationDetailsPage);
