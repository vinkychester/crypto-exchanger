import React, { useState } from "react";
import { useMutation } from "@apollo/client";

import DelayInputComponent from "../../input-group/delay-input-group";
import { parseApiErrors } from "../../../utils/response.util";

import { UPDATE_PAIR_DETAILS } from "../../../graphql/mutations/pair.mutation";

const PairDetail = ({ id, name, field, regex, successMessage, errorMessage }) => {
  const [fee, setFee] = useState(field ?? 0);
  const [errors, setErrors] = useState({});
  const [updatePairDetails, { loading }] = useMutation(UPDATE_PAIR_DETAILS,
    {
      onCompleted: () => {
        setErrors([]);
      },
      onError: ({ graphQLErrors }) => {
        setErrors(parseApiErrors(graphQLErrors));
      }
    });

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
    updatePairDetails({
      variables: { id, [name]: +value.trim().replace(/,/g, ".") }
    });
  };

  return (
    <DelayInputComponent
      label="Percent"
      type="text"
      id="percent"
      name="percent"
      handleChange={handleChangeInput}
      value={loading ? fee + " loading..." : fee}
      disabled={loading}
      autoComplete="off"
      debounceTimeout={600}
      errorMessage={errors[name] && errors[name]}
    />
  );
};

export default PairDetail;