import React, { useCallback, useState } from "react";
import { useMutation } from "@apollo/client";
import { NavLink } from "react-router-dom";

import { Helmet } from "react-helmet-async";
import DelayInputComponent from "../../components/input-group/delay-input-group";
import GoogleAuth from "../../components/google-auth/google-auth.component";
import GoogleTwoFactorsAuth from "../../components/google-auth/google-two-factors-auth.component";
import { closableNotificationWithClick } from "../../components/notification/closable-notification-with-click.component";

import { StyledRegistrationContent, StyledRegistrationForm, StyledRegistrationWrapper } from "./styled-registration";
import { StyledContainer } from "../../components/styles/styled-container";
import { StyledMainDescription, StyledMainTitle } from "../../components/styles/styled-title";
import { StyledFormText, StyledFormWrapper } from "../../components/styles/styled-form";
import { StyledButton } from "../../components/styles/styled-button";

import { CREATE_USER } from "../../graphql/mutations/user.mutation";

import { AuthContext } from "../auth/auth.component";

const INITIAL_STATE = {
  firstname: "", lastname: "", email: "", roles: "ROLE_CLIENT"
};

const RegistrationPage = () => {
  const [usertDetails, setUserDetails] = useState(INITIAL_STATE);

  const [response, setResponse] = useState(undefined);
  const [load, setLoad] = useState(false);

  const handleChangeResponse = useCallback((result) => {
    setResponse(result);
  }, [response]);

  const handleChangeLoading = useCallback((status) => {
    setLoad(status);
  }, [load]);

  const [CreateUser, { loading }] = useMutation(CREATE_USER, {
    onCompleted: (data) => {
      setUserDetails(INITIAL_STATE);
      // setErrors([]);
      closableNotificationWithClick(
        "You have successfully registered. Check your email to verify your account.",
        "success"
      );
    }
    // onError: ({ graphQLErrors }) => setErrors(parseApiErrors(graphQLErrors))
  });

  const handleChangeInput = event => {
    const { name, value } = event.target;
    setUserDetails((prevState) => ({ ...prevState, [name]: value.trim() }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    CreateUser({ variables: { ...usertDetails } });
  };

  const { firstname, lastname, email } = usertDetails;

  return (
    <StyledRegistrationWrapper>
      <StyledContainer>
        <Helmet>
          <title>Create account | BuyCoin.Cash</title>
          <meta
            name="description"
            content="Registration form in the BuyCoin.cash"
          />
        </Helmet>
        <StyledRegistrationContent>
          <StyledMainTitle color="white" size="24" position="center">
            Create account
          </StyledMainTitle>
          <StyledMainDescription
            mt="30"
            mb="50"
            color="white"
            size="16"
            position="center"
            className="registration__description"
          >
            Please, carefully fill in all the fields of the registration form. A password for logging into your account
            will be sent to your e-mail address.
          </StyledMainDescription>
          <StyledFormWrapper className="registration-form" width="540">
            {!response && <StyledRegistrationForm onSubmit={handleSubmit}>
              <div className="registration-form__content">
                <DelayInputComponent
                  id="firstname"
                  type="text"
                  label="First name"
                  name="firstname"
                  value={firstname}
                  autoComplete="off"
                  debounceTimeout={600}
                  handleChange={handleChangeInput}
                  required
                />
                <DelayInputComponent
                  id="lastname"
                  type="text"
                  label="Last name"
                  name="lastname"
                  value={lastname}
                  autoComplete="off"
                  debounceTimeout={600}
                  handleChange={handleChangeInput}
                  required
                />
                <DelayInputComponent
                  id="email"
                  type="email"
                  label="E-mail"
                  name="email"
                  value={email}
                  autoComplete="off"
                  debounceTimeout={600}
                  handleChange={handleChangeInput}
                  required
                />
              </div>
              <StyledFormText>
                <p>
                  By clicking the "Registration" or “Google” button, you confirm your agreement with the{" "}
                  <NavLink to="/" className="default-link">
                    terms of use of the service
                  </NavLink>.
                </p>
              </StyledFormText>
              <div className="registration-form__submit-align">
                <StyledButton color="main" type="submit">
                  Registration
                </StyledButton>
              </div>
            </StyledRegistrationForm>}
            <AuthContext.Provider value={{ handleChangeResponse, handleChangeLoading }}>
              {response ? <GoogleTwoFactorsAuth response={response} /> :
                <StyledFormText>
                  <p>
                    Registration or login with:
                  </p>
                  <GoogleAuth />
                </StyledFormText>}
            </AuthContext.Provider>
            {!response &&
            <StyledFormText>
              <p>
                Already have an account? {" "}
                <NavLink to="/login" className="default-link">
                  Sign In
                </NavLink>.
              </p>
            </StyledFormText>}
          </StyledFormWrapper>
        </StyledRegistrationContent>
      </StyledContainer>
    </StyledRegistrationWrapper>
  );
};

export default RegistrationPage;