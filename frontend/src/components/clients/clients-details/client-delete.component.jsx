import React from "react";
import {useMutation} from "@apollo/client";

import {UPDATE_USER_DETAILS} from "../../../graphql/mutations/user.mutation";

import { StyledButton } from "../../styles/styled-button";

  const ClientDelete = ({id}) => {

        const [updateUser, {loading}] = useMutation(UPDATE_USER_DETAILS, {
            onCompleted: () => {
               alert("User is deleted");
           }
      });

       const handleDeleteAccount = () => {
           if (window.confirm("You definitely want to delete this user?")) {
                  updateUser({
                        variables: {id, isDeleted: true}
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

  export default ClientDelete;