import React, { useEffect } from "react";
import { useQuery, useApolloClient } from "@apollo/client";

import Can from "../../components/can/can.component";
import RequisitionDetails from "../../components/requisition/requisition-details/requisition-details.component";
import AlertMessage from "../../components/alert/alert.component";

import { GET_USER_CACHE_DETAILS } from "../../graphql/queries/user.query";
import { GET_REQUISITION_DETAILS } from "../../graphql/queries/requisition.query";
import { mercureUrl, parseUuidIRI } from "../../utils/response.util";
import { requisition } from "../../rbac-consts";

const RequisitionDetailsPage = ({ match }) => {
  const clientApollo = useApolloClient();

  const { id } = match.params;
  const { userRole, userId } = clientApollo.readQuery({
    query: GET_USER_CACHE_DETAILS,
  });

  const { loading, error, data, refetch } = useQuery(GET_REQUISITION_DETAILS, {
    variables: { id: "/api/requisitions/" + id },
    fetchPolicy: "network-only",
  });

  mercureUrl.searchParams.append("topic", `http://buycoin/callback/${id}`);
  mercureUrl.searchParams.append("topic", `http://buycoin/invoice/${id}`);

  useEffect(() => {
    const eventSource = new EventSource(mercureUrl);
    eventSource.onmessage = (event) => {
      console.log(event);
      refetch({
        variables: { id: "/api/requisitions/" + id },
      });
    };

    return () => {
      eventSource.close();
    };
  }, []);

  if (loading) return "loading...";
  if (error) return "Error";
  if (!data) return "Not found";

  const { client, ...props } = data.requisition;

  let permissions = {};

  if (userRole === "client")
    permissions = { userId, ownerId: parseUuidIRI(client.id) };

  return (
    <Can
      role={userRole}
      perform={requisition.READ_DETAILS}
      data={permissions}
      yes={() => <RequisitionDetails client={client} refetch={refetch} {...props} />}
      no={() => <AlertMessage center margin="50px auto" type="error" message="Access denied" />}
    />
  );
};

export default React.memo(RequisitionDetailsPage);
