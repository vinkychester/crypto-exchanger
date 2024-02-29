import React from "react";

import DelayInputComponent from "../input-group/delay-input-group";

import { handleChange } from "../../utils/filter.util";

const FilterUserDetails = ({
  firstname,
  lastname,
  email,
  handleChangeFilter,
}) => {
  return (
    <>
      <DelayInputComponent
        type="text"
        name="firstname"
        label="Given name"
        handleChange={(e) => handleChange(e, handleChangeFilter)}
        value={firstname ?? ""}
        debounceTimeout={600}
        autoComplete="off"
      />
      <DelayInputComponent
        type="text"
        name="lastname"
        label="Family name"
        handleChange={(e) => handleChange(e, handleChangeFilter)}
        value={lastname ?? ""}
        debounceTimeout={600}
        autoComplete="off"
      />
      <DelayInputComponent
        type="text"
        name="email"
        label="E-mail"
        handleChange={(e) => handleChange(e, handleChangeFilter)}
        value={email ?? ""}
        debounceTimeout={600}
        autoComplete="off"
      />
    </>
  );
};

export default React.memo(FilterUserDetails);
