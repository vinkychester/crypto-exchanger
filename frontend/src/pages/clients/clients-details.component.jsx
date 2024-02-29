import React from "react";
import { useApolloClient, useQuery } from "@apollo/client";

import ClientsDetails from "../../components/clients/clients-details/clients-details.component";

import { GET_USER_CACHE_DETAILS, GET_USER_DETAILS } from "../../graphql/queries/user.query";

const ClientsDetailsPage = ({ match }) => {
  const { id } = match.params;
  const clientApollo = useApolloClient();

  const { userRole } = clientApollo.readQuery({
    query: GET_USER_CACHE_DETAILS,
  });

  const { data, loading, error } = useQuery(GET_USER_DETAILS, {
    fetchPolicy: "network-only",
    variables: {
      id: `/api/users/${id}`,
    },
  });

  if (loading) return "loading...";
  if (error) return "Error";
  if (!data) return "No users";

  const { user } = data;

  return (
    <ClientsDetails user={user} />
  )
};

export default ClientsDetailsPage;