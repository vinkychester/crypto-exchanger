import React, { useCallback, useContext } from "react";
import { useMutation, useApolloClient } from "@apollo/client";

import AccountDelete from "./account-delete.component";
import { UserAccountContext } from "../../pages/account/account.component";
import { parseApiErrors } from "../../utils/response.util";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";

import Spinner from "../spinner/spinner.component";
import InputGroupComponent from "../input-group/input-group.component";

import { StyledButton } from "../styles/styled-button";

import { UPDATE_DETAILS_ACCOUNT } from "../../graphql/mutations/account.mutation";
import { GET_USER_CACHE_DETAILS } from "../../graphql/queries/user.query";

const AccountUserInformation = () => {
  const client = useApolloClient();
  const { user } = useContext(UserAccountContext);
  const { userRole } = client.readQuery({
    query: GET_USER_CACHE_DETAILS
  });

  const [updateAccountDetails, { loading }] = useMutation(UPDATE_DETAILS_ACCOUNT,
    {
      onCompleted: () => {
        closableNotificationWithClick(
          "You have successfully changed your account details",
          "success"
        );
      },
      onError: ({ graphQLErrors }) => {
        let error = parseApiErrors(graphQLErrors);
        if (error.internal) {
          closableNotificationWithClick(error.internal, "error");
        }
      },
      variables: {
        firstname: "",
        lastname: ""
      }
    }
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      let variables = {
        id: user.id,
        firstname: event.target["firstname"].value,
        lastname: event.target["lastname"].value
      };

      updateAccountDetails({
        variables
      });
    },
    [updateAccountDetails]
  );

  return (
    <>
      <form onSubmit={handleSubmit}>

        {loading && <Spinner position="center" />}
        <div className={`client-name ${loading && "loading"}`}>
          <InputGroupComponent
            id="firstname"
            label="Имя"
            type="String!"
            defaultValue={user.firstname}
          />
          <InputGroupComponent
            id="lastname"
            label="Фамилия"
            type="String!"
            defaultValue={user.lastname}
          />
          <InputGroupComponent
            id="email"
            label="E-mail"
            defaultValue={user.email}
            readOnly
          />
          <div className="button-align">
            <StyledButton color="success" weight="normal" type="submit">
              Save
            </StyledButton>
            {userRole === "client" && !user.isDeleted && <AccountDelete />}
          </div>
        </div>

      </form>
    </>
  );
};
export default AccountUserInformation;
