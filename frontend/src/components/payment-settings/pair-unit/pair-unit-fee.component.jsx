import React, { useState } from "react";
import { useMutation } from "@apollo/client";

import DelayInputComponent from "../../input-group/delay-input-group";
import { parseApiErrors } from "../../../utils/response.util";

import { UPDATE_PAIR_UNIT_DETAILS } from "../../../graphql/mutations/pair-unit.mutation";

const PairUnitFee = ({ id, name, field, regex, successMessage, errorMessage, className }) => {
  const [fee, setFee] = useState(field ?? 0);
  const [errors, setErrors] = useState({});

  const [updatePairUnitDetails, { loading }] = useMutation(
    UPDATE_PAIR_UNIT_DETAILS,
    {
      onCompleted: () => {
        setErrors([]);
      },
      onError: ({ graphQLErrors }) => {
        setErrors(parseApiErrors(graphQLErrors));
      }
    }
  );
  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    setFee(value.trim().replace(/,/g, "."));
    if (value.trim() === "") {
      setErrors({ [name]: "The value must not be empty" });
      return false;
    }
    if (!value.trim().replace(/,/g, ".").match(regex)) {
      setErrors({ [name]: errorMessage });
      return false;
    }
    updatePairUnitDetails({
      variables: { id, [name]: +value.trim().replace(/,/g, ".") }
    });
  };

  return (
    <DelayInputComponent
      className={className}
      label={name}
      type="text"
      name={name}
      handleChange={handleChangeInput}
      value={loading ? fee + " loading..." : fee}
      disabled={loading}
      errorMessage={errors[name]}
      debounceTimeout={600}
    />
  );
};

export default PairUnitFee;