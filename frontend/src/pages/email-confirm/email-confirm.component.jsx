import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";

import { CONFIRM_EMAIL } from "../../graphql/mutations/user.mutation";

import { StyledButton } from "../../components/styles/styled-button";
import { StyledContainer } from "../../components/styles/styled-container";

import AlertMessage from "../../components/alert/alert.component";
import Spinner from "../../components/spinner/spinner.component";

import { parseApiErrors } from "../../utils/response.util";
import { generateHash } from "../../utils/hash.utils";

const EmailConfirmPage = () => {
  let history = useHistory();
  let regex = /\?token=(\w+)/;

  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccessMessage, setSuccessMessage] = useState(false);

  const [confirmEmail, { loading }] = useMutation(CONFIRM_EMAIL, {

    onCompleted: (data) => {
      setSuccessMessage(!isSuccessMessage);
      setErrorMessage("");
      localStorage.setItem("first_login" + generateHash(data.confirmationMutationUser.user.id), "first_login");
    },
    onError: ({ graphQLErrors }) => setErrorMessage(parseApiErrors(graphQLErrors))
  });

  useEffect(() => {
    const { search } = history.location;

    if (null === search.match(regex)) {
      history.push("/");
    } else {
      confirmEmail({ variables: { token: search.match(regex)[1] } });
    }

  }, []);

  if (loading) return < Spinner />;

  return (

    <StyledContainer>
      {errorMessage && <AlertMessage type="error" message={errorMessage.internal} margin="0 0 20px" />}
      {isSuccessMessage ?
        <AlertMessage type="success" message="Account successfully verified" margin="0 0 20px" /> : null}
      <StyledButton as={NavLink} to="/login">
        Login
      </StyledButton>
    </StyledContainer>

  );
};

export default React.memo(EmailConfirmPage);
