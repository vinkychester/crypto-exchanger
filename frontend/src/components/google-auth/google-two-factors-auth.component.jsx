import React, { useContext, useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useApolloClient } from "@apollo/client";

import jwt_decode from "jwt-decode";
import InputGroupComponent from "../input-group/input-group.component";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";

import { StyledGoogleTwoFactorsWrapper } from "./styled-google-two-factors";
import { StyledButton } from "../styles/styled-button";
import { StyledFormText } from "../styles/styled-form";

import { GET_USER_CACHE_DETAILS } from "../../graphql/queries/user.query";

import { AuthContext } from "../../pages/auth/auth.component";

const GoogleTwoFactorsAuth = ({ response }) => {
  const history = useHistory();
  const client = useApolloClient();

  const { handleChangeLoading } = useContext(AuthContext);

  const [code, setCode] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    document.getElementById("code").focus();
  }, []);

  const handleChangeInput = ({ target }) => {
    setCode(target.value.replace(/\D/, ""));
  };

  const handleSubmit = event => {
    event.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: response.id, code })
    };

    fetch("/api/google_two_factor_check", requestOptions).then(async response => {
      const isJson = response.headers.get("content-type")?.includes("application/json");
      const data = isJson && await response.json();

      if (response.status === 403) {
        closableNotificationWithClick("Invalid auth code", "error");
      }

      if (response.status === 200) {
        localStorage.setItem("token", data.token);
        const { id, role, username } = jwt_decode(data.token);

        client.writeQuery({
          query: GET_USER_CACHE_DETAILS,
          data: { isLoggedIn: true, userId: id, userRole: role, username }
        });

        history.push("/panel/requisitions");
      }
    });
  };

  return (
    <StyledGoogleTwoFactorsWrapper>
      <form onSubmit={handleSubmit} className="two-factor-form">
        <InputGroupComponent
          id="code"
          type="text"
          autocomplete="off"
          label="Enter two-factor authentication code"
          name="code"
          value={code}
          handleChange={handleChangeInput}
          className="two-factor-form__input"
          maxLength="6"
          required
        />
        <div className="two-factor-form__submit-align">
          <StyledButton color="main" type="submit">
            Confirm
          </StyledButton>
        </div>
      </form>
      <StyledFormText>
        <p>
          Lost security code?{" "}
          <NavLink
            to="/contacts"
            className="default-link"
          >Contact Support
          </NavLink>.
        </p>
      </StyledFormText>
    </StyledGoogleTwoFactorsWrapper>
  );
};

export default GoogleTwoFactorsAuth;