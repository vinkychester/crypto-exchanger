import React from "react";
import { useMutation } from "@apollo/client";

import { UPDATE_USER_DETAILS } from "../../../graphql/mutations/user.mutation";

import { StyledButton } from "../../styles/styled-button";

const ClientBan = ({ id }) => {

  const [updateUser, { loading }] = useMutation(UPDATE_USER_DETAILS, {
    onCompleted: () => {
      alert("User is banned");
    }
  });

  const handleBanAccount = () => {
    if (window.confirm("You definitely want to ban this user?")) {
      updateUser({
        variables: { id, isBanned: true }
      });
    }
  };

  return (
    <>
      <StyledButton
        color="warning"
        weight="normal"
        type="button"
        onClick={handleBanAccount}
      >
        Ban account
      </StyledButton>
    </>
  );
};

export default ClientBan;