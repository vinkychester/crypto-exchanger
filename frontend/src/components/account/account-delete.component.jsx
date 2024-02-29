import React, { useCallback, useContext, useState } from "react";
import { useMutation, useApolloClient, gql } from "@apollo/client";
import { useHistory } from "react-router-dom";

import { StyledButton } from "../styles/styled-button";

import { UserAccountContext } from "../../pages/account/account.component";

import { UPDATE_USER_DETAILS } from "../../graphql/mutations/user.mutation";
import { GET_USER_CACHE_DETAILS, GET_USER_DETAILS } from "../../graphql/queries/user.query";

const AccountDelete = () => {
  const history = useHistory();
  const [visible, setVisible] = useState(false);
  const { user } = useContext(UserAccountContext);

  const client = useApolloClient();

  const [updateClient, { loading }] = useMutation(UPDATE_USER_DETAILS, {
    onCompleted: () => {
      setVisible(false);
      client.writeQuery({
        query: GET_USER_CACHE_DETAILS,
        data: {
          userDetails: {
            userId: "",
            userRole: "",
            isLoggedIn: false,
            username: "",
            __typename: "UserDetails"
          }
        }
      });
      localStorage.removeItem("token");
      history.push("/");
    }
  });

  const handleDeleteAccount = () => {
    if (window.confirm("You will not be able to restore your account?")) {
      updateClient({
        variables: { id: user.id, isDeleted: true }
      });

    }

  };

  return (
    <>
      <StyledButton
        color="danger"
        weight="normal"
        type="button"
        onClick={handleDeleteAccount}
      >
        Delete account
      </StyledButton>
    </>
  );
};

export default AccountDelete;
