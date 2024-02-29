import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation } from "@apollo/client";

import { CHANGE_PASSWORD } from "../../graphql/mutations/user.mutation";

import { parseApiErrors } from "../../utils/response.util";

import DelayInputComponent from "../input-group/delay-input-group";
import AlertMessage from "../alert/alert.component";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";

import { StyledFormWrapper } from "../styles/styled-form";
import { StyledButton } from "../styles/styled-button";

export const INITIAL_STATE = { newPassword: "", newRetypedPassword: "" };

const ChangePasswordContainer = () => {

  const { token } = useParams();
  const [errors, setErrors] = useState([]);
  const [passwordDetails, setPasswordDetails] = useState(INITIAL_STATE);

  const [changePassword, { loading }] = useMutation(CHANGE_PASSWORD, {
    onCompleted: () => {
      setPasswordDetails(INITIAL_STATE);
      setErrors([]);
      closableNotificationWithClick("You have successfully changed your password", "success");
    },
    onError: ({ graphQLErrors }) => {
      let error = parseApiErrors(graphQLErrors);
      error.internal ? closableNotificationWithClick(error.internal, "error") : setErrors(error);
    }
  });
  const handleSubmit = (event) => {
    event.preventDefault();
    changePassword({
      variables: { token, ...passwordDetails }
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPasswordDetails((prevState) => ({
      ...prevState,
      [name]: value.trim()
    }));
  };

  if (!token) return <AlertMessage type="warning" message="Invalid token" />;
  const { newPassword, newRetypedPassword } = passwordDetails;

  return (
    <>
      <StyledFormWrapper
        className={`change-password-form ${loading && "loading"}`}
        onSubmit={handleSubmit}
      >
        Enter a new password
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
        <div className="change-password-form__footer">
          <StyledButton color="main" type="submit" disabled={!token} onClick={handleSubmit}>
            Change Password
          </StyledButton>
        </div>
      </StyledFormWrapper>
    </>
  );
};

export default ChangePasswordContainer;
