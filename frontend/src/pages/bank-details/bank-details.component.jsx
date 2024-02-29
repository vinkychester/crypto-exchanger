import React from "react";
import { useApolloClient } from "@apollo/client";

import { GET_USER_CACHE_DETAILS } from "../../graphql/queries/user.query";

import BankDetailsContainer from "../../components/bank-details/bank-details.container";
import Can from "../../components/can/can.component";
import AlertMessage from "../../components/alert/alert.component";

import { bankDetails } from "../../rbac-consts";

const BankDetailsPage = () => {
  const client = useApolloClient();
  const { userRole } = client.readQuery({ query: GET_USER_CACHE_DETAILS });
  return (
    <Can
      role={userRole}
      perform={bankDetails.ACTIONS}
      yes={() => (
        <BankDetailsContainer />
      )}
      no={() => <AlertMessage center margin="50px auto" type="error" message="Access denied" />}
    />
  );
};

export default React.memo(BankDetailsPage);