import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useApolloClient, useMutation } from "@apollo/client";
import Checkbox from "rc-checkbox";

import { StyledCheckboxLabel, StyledCheckboxWrapper } from "../styles/styled-checkbox";
import { StyledAgreeMessage } from "./styled-calculator";
import { StyledButton } from "../styles/styled-button";

import { GET_USER_CACHE_DETAILS } from "../../graphql/queries/user.query";
import { CREATE_REQUISITION } from "../../graphql/mutations/requisition.mutation";
import { CalculatorContext } from "./calculator.container";
import { validateCryptoWallet } from "../../utils/crypto.util";
import { parseUuidIRI } from "../../utils/response.util";

const CalculatorRequisites = ({ requisitionDetails, exchangeValue }) => {
  const history = useHistory();
  const client = useApolloClient();

  const { handleChangeErrors } = useContext(CalculatorContext);
  const { userId } = client.readQuery({ query: GET_USER_CACHE_DETAILS });

  const [createRequisition, { loading }] = useMutation(CREATE_REQUISITION, {
    onCompleted: ({ createRequisition }) => {
      history.push(`/panel/requisition-details/${parseUuidIRI(createRequisition.requisition.id)}`);
    },
  });

  const [isTermsAccepted, setTermsAccepted] = useState(false);

  const __findByTag = (array, tag) => {
    return array.find((item) => item.name === tag)
  };

  const handleCreateRequisition = () => {
    const { paymentAttributes, payoutAttributes, paymentAmount, payoutAmount, ...props } = requisitionDetails;

    let isWalletError = false;
    const wallet = __findByTag(paymentAttributes, "wallet") || __findByTag(payoutAttributes, "wallet");

    if (wallet) {
      const { paymentExchangeValue, payoutExchangeValue } = exchangeValue;
      const crypto =
        paymentExchangeValue.currency.tag === "CRYPTO"
          ? paymentExchangeValue.currency.asset
          : payoutExchangeValue.currency.asset;

      if (!validateCryptoWallet(crypto, wallet.value.trim())) {
        handleChangeErrors({ wallet: "Wallet is not valid" });
        isWalletError = true;
      }
    }

    if (!isWalletError) {
      createRequisition({
        variables: {
          client: `/api/users/${userId}`,
          paymentAttributes,
          payoutAttributes,
          paymentAmount: parseInt(paymentAmount),
          payoutAmount: parseInt(payoutAmount),
          ...props,
        },
      });
    }
  };

  return (
    <>
      <StyledCheckboxWrapper margin="10px 0 0">
        <Checkbox
          id="isTermsAccepted"
          name="isTermsAccepted"
          className="default-checkbox"
          onClick={() => setTermsAccepted(!isTermsAccepted)}
          value={isTermsAccepted}
        />
        <StyledCheckboxLabel position="right" htmlFor="isTermsAccepted">
          I have read and agree with {" "}
          <NavLink to="/user-agreement" className="default-link" target="_blank" rel="noreferrer">
            service usage rules.
          </NavLink>.
        </StyledCheckboxLabel>
      </StyledCheckboxWrapper>
      <StyledAgreeMessage>
        <p>
          By clicking on the "Create order" button, you agree to service usage rules.
        </p>
        <StyledButton
          color="main"
          disabled={!isTermsAccepted}
          onClick={handleCreateRequisition}
          type="button"
        >
          Create order
        </StyledButton>
      </StyledAgreeMessage>
    </>
  );
};

export default React.memo(CalculatorRequisites);
