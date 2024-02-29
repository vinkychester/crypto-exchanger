import React, { createContext } from "react";

import ClientsFilter from "./clients-filter.component";
import ClientsList from "./clients-list.component";

import { useFilter } from "../../hooks/filter.hook";

export const ClientsFilterContext = createContext();

const ClientsListContainer = ({ sign }) => {
  const [filter, handleClearFilter, handleChangeFilter] = useFilter(sign);

  return (
    <ClientsFilterContext.Provider
      value={{ filter, handleClearFilter, handleChangeFilter, sign }}
    >
      <ClientsFilter />
      <ClientsList />
    </ClientsFilterContext.Provider>
  );
};

export default ClientsListContainer;
