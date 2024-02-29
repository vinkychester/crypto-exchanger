import React, { useContext } from "react";

import { ClientsFilterContext } from "./clients-list.container";

const ClientsFilter = () => {
  const { filter, sign, handleChangeFilter, handleClearFilter } = useContext(ClientsFilterContext);

  return (
    <>
      <label htmlFor="firstname">Given name</label>
      <input
        type="text"
        id="firstname"
        name={`${sign}firstname`}
        onChange={({ target }) => handleChangeFilter(target.name, target.value.trim())}
        value={filter[`${sign}firstname`] ?? ""}
        autoComplete="off"
      />
      <label htmlFor="lastname">Family name</label>
      <input
        type="text"
        id="lastname"
        name={`${sign}lastname`}
        onChange={({ target }) => handleChangeFilter(target.name, target.value.trim())}
        value={filter[`${sign}lastname`] ?? ""}
        autoComplete="off"
      />
      <label htmlFor="email">E-mail</label>
      <input
        type="text"
        id="email"
        name={`${sign}email`}
        onChange={({ target }) => handleChangeFilter(target.name, target.value.trim())}
        value={filter[`${sign}email`] ?? ""}
        autoComplete="off"
      />
      <button onClick={handleClearFilter}>Clear</button>
    </>
  )
};

export default ClientsFilter;