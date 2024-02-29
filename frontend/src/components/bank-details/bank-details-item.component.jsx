import React, { useState } from "react";
import { useMutation } from "@apollo/client";

import BankDetailsItemAttribute from "./bank-details-item-attribute.component";
import DelayInputComponent from "../input-group/delay-input-group";

import { UPDATE_BANK_DETAILS } from "../../graphql/mutations/bank-detail.mutation";

import { parseApiErrors } from "../../utils/response.util";

const BankDetailsItem = ({ id, title, attributes, pairUnit }) => {
  const { paymentSystem, currency } = pairUnit;

  const [errors, setErrors] = useState({});
  const [updateBankDetail, { loading }] = useMutation(
    UPDATE_BANK_DETAILS, {
      onComplete: () => {
        setErrors({});
      },
      onError: ({ graphQLErrors }) => setErrors(parseApiErrors(graphQLErrors))
    }
  );

  const handleChangeBankDetails = (event) => {
    const { name, value } = event.target;
    if (value !== "") {
      updateBankDetail({
        variables: { id, [name]: value.trim() }
      });
    }
  };

  return (
    <>
      <tr>
        <td>
          <b>{paymentSystem.name}</b> {currency.asset}<br />
          <small>{pairUnit.direction}</small>
        </td>
        <td>
          <DelayInputComponent
            label="Name"
            type="text"
            name="title"
            handleChange={handleChangeBankDetails}
            value={title}
            autoComplete="off"
            debounceTimeout={600}
            readonly={loading}
            errorMessage={errors.title}
          />
          {loading && (
            <span>loading</span>
          )}
        </td>
        {attributes.map(({ id, ...props }) => (
          <BankDetailsItemAttribute key={id} id={id} currency={currency} {...props} />
        ))}
        <td>
          <button>
            delete
          </button>
        </td>
      </tr>
    </>
  );
};

export default BankDetailsItem;