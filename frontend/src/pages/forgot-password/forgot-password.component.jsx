import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useMutation } from "@apollo/client";

import DelayInputComponent from "../../components/input-group/delay-input-group";

import { FORGOT_PASSWORD } from "../../graphql/mutations/user.mutation";

import { closableNotificationWithClick } from "../../components/notification/closable-notification-with-click.component";
import { parseApiErrors } from "../../utils/response.util";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledButton } from "../../components/styles/styled-button";


const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setSuccess] = useState(false);

  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD, {
    onCompleted: () => {
      setSuccess(!isSuccess);
      setEmail("");
      setErrorMessage("");
      closableNotificationWithClick(
        "We will send you a letter with instructions for recovery. Please check your email.",
        "success"
      );
    },
    onError: ({ graphQLErrors }) => setErrorMessage(parseApiErrors(graphQLErrors))
  });

  const handleSubmit = () => {
    forgotPassword({ variables: { email } });
  };

  return (
    <StyledContainer>
      <div>
        Forgot your password?
      </div>
      <div>
        Please enter the email address you used to create the account. We will send
        you will receive an email with a link to reset your password.
      </div>
      <DelayInputComponent
        id="email"
        type="email"
        name="email"
        label="E-mail"
        value={email}
        handleChange={(event) => setEmail(event.target.value.trim())}
        debounceTimeout={600}
        errorMessage={errorMessage.internal}
        required
      />
      <div className="forgot-password-form__footer">
        <StyledButton color="main" type="submit" onClick={handleSubmit}>
          Confirm
        </StyledButton>
      </div>
      <NavLink className="default-link forgot-password-form__account" to="/login">
        I already have an account
      </NavLink>
    </StyledContainer>
  );
};

export default React.memo(ForgotPasswordPage);
