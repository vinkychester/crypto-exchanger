import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import jwtDecode from "jwt-decode";

import AlertMessage from "../alert/alert.component";
import DelayInputComponent from "../input-group/delay-input-group";
import Spinner from "../spinner/spinner.component";

import { StyledButton } from "../styles/styled-button";

import { ACCOUNT_CHANGE_PASSWORD } from "../../graphql/mutations/user.mutation";

import { parseApiErrors } from "../../utils/response.util";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";

export const INITIAL_STATE = { oldPassword: "", newPassword: "", newRetypedPassword: "" };

const AccountChangePassword = ({ firstLogin, setFirstLogin }) => {
  const [{ id }] = useState(jwtDecode(localStorage.getItem("token")));
  const [errors, setErrors] = useState([]);
  const [passwordDetails, setPasswordDetails] = useState(INITIAL_STATE);

  const [changePassword, { loading }] = useMutation(ACCOUNT_CHANGE_PASSWORD, {
    onCompleted: () => {
      setPasswordDetails(INITIAL_STATE);
      setErrors([]);
      setFirstLogin(false);
      closableNotificationWithClick("\n" + "You have successfully changed your password", "success");
    },
    onError: ({ graphQLErrors }) => {
      let error = parseApiErrors(graphQLErrors);
      error.internal ? closableNotificationWithClick(error.internal, "error") : setErrors(error);
    }
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    changePassword({
      variables: { id: "/api/users/" + id, ...passwordDetails }
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPasswordDetails((prevState) => ({
      ...prevState,
      [name]: value.trim()
    }));
  };
  const { oldPassword, newPassword, newRetypedPassword } = passwordDetails;

  return (
    <div className="change-password-form__group">
      {loading  && <Spinner position="center" />}
      {firstLogin && (
        <AlertMessage
          margin="0 0 30px"
          type="warning"
          message="For security reasons, we ask you to change your password."
        />
      )}
      <DelayInputComponent
        id="oldPassword"
        type="password"
        name="oldPassword"
        label="Old password"
        value={oldPassword}
        handleChange={handleChange}
        debounceTimeout={600}
        errorMessage={errors.oldPassword}
        required
      />
      <DelayInputComponent
        id="newPassword"
        type="password"
        name="newPassword"
        label="New password"
        value={newPassword}
        handleChange={handleChange}
        debounceTimeout={600}
        errorMessage={errors.newPassword}
        required
      />
      <DelayInputComponent
        id="newRetypedPassword"
        type="password"
        name="newRetypedPassword"
        label="Confirm new password"
        value={newRetypedPassword}
        handleChange={handleChange}
        debounceTimeout={600}
        errorMessage={errors.newRetypedPassword}
        required
      />
      <div className="submit-btn">
        <StyledButton color="main" type="submit" onClick={handleSubmit}>
          Change
        </StyledButton>
      </div>
    </div>
  );
};

export default AccountChangePassword;
