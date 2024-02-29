import React, { useContext } from "react";
import { GoogleLogin } from "react-google-login";
import { useApolloClient } from "@apollo/client";
import { useHistory } from "react-router-dom";

import jwt_decode from "jwt-decode";

import { StyledCircleButton } from "../styles/styled-button";

import { GET_USER_CACHE_DETAILS } from "../../graphql/queries/user.query";
import { REACT_APP_GOOGLE_CLIENT_ID } from "../../utils/response.util";
import { AuthContext } from "../../pages/auth/auth.component";

const GoogleAuth = () => {
  const history = useHistory();
  const client = useApolloClient();
  const { handleChangeResponse, handleChangeLoading } = useContext(AuthContext);

  const responseGoogle = response => {
    if (response.error) {
      // setLoading(false);
      // closableNotificationWithClick("Ошибочный вход", "info");
      return;
    }
    const { tokenId, profileObj: { email } } = response;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokenId, email })
    };

    fetch("/api/google_check", requestOptions).then(async response => {
      const isJson = response.headers.get("content-type")?.includes("application/json");
      const data = isJson && await response.json();

      if (response.status === 200) {
        if (data.id) {
          handleChangeResponse(data);
        } else {
          localStorage.setItem("token", data.token);
          const { id, role, username } = jwt_decode(data.token);

          client.writeQuery({
            query: GET_USER_CACHE_DETAILS,
            data: { isLoggedIn: true, userId: id, userRole: role, username }
          });

          history.push("/panel/requisitions");
        }
      }
    }).catch(error => {

    });
  };

  return (
    <GoogleLogin
      clientId={REACT_APP_GOOGLE_CLIENT_ID}
      render={renderProps => (
        <StyledCircleButton
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
          type="button"
          className="login-with-google"
        >
          <span className="icon-google" />
        </StyledCircleButton>
      )}
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={"single_host_origin"}
    />
  );
};

export default GoogleAuth;
