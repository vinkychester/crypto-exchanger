import React from "react";
import { useApolloClient } from "@apollo/client";

import Can from "../../components/can/can.component";
import FeedbackDetailsContainer from "../../components/feedback/feedback-details/feedback-details.container.component";

import { GET_USER_CACHE_DETAILS } from "../../graphql/queries/user.query";

import { feedbacks } from "../../rbac-consts";

const FeedbackDetailsPage = ({ match }) => {
  const client = useApolloClient();

  const { id } = match.params;

  const { userRole } = client.readQuery({
    query: GET_USER_CACHE_DETAILS
  });

  return (
    <Can
      role={userRole}
      perform={feedbacks.DETAILS}
      yes={() => <FeedbackDetailsContainer id={id} />}
      no={() => <h1>No Access</h1>}
    />
  );
};

export default React.memo(FeedbackDetailsPage);