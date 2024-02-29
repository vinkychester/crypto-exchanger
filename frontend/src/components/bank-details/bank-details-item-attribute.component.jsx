import React, { useState } from "react";
import { useMutation } from "@apollo/client";

import DelayInputComponent from "../input-group/delay-input-group";

import { validateCryptoWallet } from "../../utils/crypto.util";
import { parseApiErrors } from "../../utils/response.util";

import { UPDATE_ATTRIBUTE_DETAILS } from "../../graphql/mutations/attribute.mutation";

const BankDetailsItemAttribute = ({ id, name, value, currency }) => {
  const [errors, setErrors] = useState({});

  const [updateAttributeDetail, { loading }] = useMutation(
    UPDATE_ATTRIBUTE_DETAILS, {
      onComplete: () => {
        setErrors((prevState) => ({ ...prevState, [name]: "" }));
      },
      onError: ({ graphQLErrors }) => setErrors(parseApiErrors(graphQLErrors))
    }
  );

  const handleChangeAttribute = (event) => {
    const { name, value } = event.target;
    if (value !== "") {
      let regex = /\(\w+\)/;
      if ("wallet" === name && !regex.test(currency.asset) && !validateCryptoWallet(currency.asset, value.trim())) {
        setErrors({ wallet: "Невалидный кошелек" });
      } else {
        setErrors((prevState) => ({ ...prevState, wallet: "" }));
        updateAttributeDetail({
          variables: { id, value: value.trim() }
        });
      }
    }
  };

  return (
    <td>
      <DelayInputComponent
        label={name}
        type="text"
        name={name}
        handleChange={handleChangeAttribute}
        value={value}
        autoComplete="off"
        debounceTimeout={600}
        readonly={loading}
        errorMessage={errors[name]}
      />
      {loading && (
        <span>loading</span>
      )}
    </td>
  );
};

export default React.memo(BankDetailsItemAttribute);