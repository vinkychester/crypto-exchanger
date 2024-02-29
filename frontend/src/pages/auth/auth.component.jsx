import React, { createContext, useCallback, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useApolloClient } from "@apollo/client";
import { Helmet } from "react-helmet-async";

import jwt_decode from "jwt-decode";

import GoogleAuth from "../../components/google-auth/google-auth.component";
import GoogleTwoFactorsAuth from "../../components/google-auth/google-two-factors-auth.component";
import DelayInputComponent from "../../components/input-group/delay-input-group";

import { StyledContainer } from "../../components/styles/styled-container";
import {
  StyledLoginContent,
  StyledLoginForm,
  StyledLoginWrapper,
} from "./styled-auth";
import { StyledButton } from "../../components/styles/styled-button";
import {
  StyledMainDescription,
  StyledMainTitle,
} from "../../components/styles/styled-title";
import {
  StyledFormText,
  StyledFormWrapper,
} from "../../components/styles/styled-form";

import { GET_USER_CACHE_DETAILS } from "../../graphql/queries/user.query";

export const AuthContext = createContext();

const INITIAL_STATE = {
  username: "",
  password: "",
};

const AuthPage = () => {
  const history = useHistory();
  const client = useApolloClient();

  const [userCredentials, setUserCredentials] = useState(INITIAL_STATE);
  const [response, setResponse] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const handleChangeResponse = useCallback(
    (result) => {
      setResponse(result);
    },
    [response]
  );

  const handleChangeLoading = useCallback(
    (status) => {
      setLoading(status);
    },
    [loading]
  );

  const handleChangeInput = (event) => {
    const { value, name } = event.target;
    setUserCredentials({ ...userCredentials, [name]: value.trim() });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...userCredentials }),
    };

    fetch("/api/login_check", requestOptions)
      .then(async (response) => {
        const isJson = response.headers
          .get("content-type")
          ?.includes("application/json");
        const data = isJson && (await response.json());
        if (response.status === 200) {
          localStorage.setItem("token", data.token);
          const { id, role, username } = jwt_decode(data.token);

          client.writeQuery({
            query: GET_USER_CACHE_DETAILS,
            data: { isLoggedIn: true, userId: id, userRole: role, username }
          });

          history.push("/panel/requisitions");
        }
      })
      .catch((error) => {});
  };

  const { username, password } = userCredentials;

  return (
    <StyledLoginWrapper>
      <StyledContainer>
        <Helmet>
          <title>Sign In | BuyCoin.Cash</title>
          <meta
            name="description"
            content="If you are already registered through our website, please login using the authorization form"
          />
        </Helmet>
        <StyledLoginContent>
          <StyledMainTitle color="white" size="24" position="center">
            Sign In
          </StyledMainTitle>
          <StyledMainDescription
            mt="30"
            mb="50"
            color="white"
            size="16"
            position="center"
          >
            and let's do exchange!
          </StyledMainDescription>
          <StyledFormWrapper className="login-form" width="540">
            <AuthContext.Provider
              value={{ handleChangeResponse, handleChangeLoading }}
            >
              {response ? (
                <GoogleTwoFactorsAuth response={response} />
              ) : (
                <StyledFormText>
                  <GoogleAuth />
                  <p>or use your e-mail:</p>
                </StyledFormText>
              )}
            </AuthContext.Provider>
            {!response && (
              <StyledLoginForm onSubmit={handleSubmit}>
                <div className="login-form__content">
                  <DelayInputComponent
                    id="username"
                    type="email"
                    label="E-mail"
                    name="username"
                    value={username}
                    autoComplete="off"
                    debounceTimeout={600}
                    handleChange={handleChangeInput}
                    required
                  />
                  <DelayInputComponent
                    id="password"
                    type="password"
                    label="Password"
                    name="password"
                    value={password}
                    autoComplete="off"
                    debounceTimeout={600}
                    handleChange={handleChangeInput}
                    required
                  />
                </div>
                <StyledFormText>
                  <NavLink to="/forgot-password" className="default-link forgot-password">
                    Forgot your password?
                  </NavLink>
                </StyledFormText>
                <StyledFormText>
                  <p>
                    By clicking the "Login" or “Google” button, you confirm your
                    agreement with the{" "}
                    <NavLink to="/" className="default-link">
                      terms of use of the service
                    </NavLink>
                    .
                  </p>
                </StyledFormText>
                <div className="login-form__submit-align">
                  <StyledButton color="main" type="submit">
                    Login
                  </StyledButton>
                </div>
                <StyledFormText>
                  <p>
                    Don't have an account yet?{" "}
                    <NavLink to="/registration" className="default-link">
                      Register now
                    </NavLink>
                    .
                  </p>
                </StyledFormText>
              </StyledLoginForm>
            )}
          </StyledFormWrapper>
        </StyledLoginContent>
      </StyledContainer>
    </StyledLoginWrapper>
  );
};

export default AuthPage;
