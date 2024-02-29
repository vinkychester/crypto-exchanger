import React, { createContext } from "react";
import { useHistory } from "react-router-dom";

import CurrencyList from "./currency-list.component";

import { useFilter } from "../hooks/filter.hook";

export const CurrencyFilterContext = createContext();

const CurrencyContainer = ({ tag }) => {
  const [filter, handleClearFilter, handleChangeFilter] = useFilter();

  return (
    <CurrencyFilterContext.Provider
      value={{ filter, handleClearFilter, handleChangeFilter, tag }}
    >
      <CurrencyList />
    </CurrencyFilterContext.Provider>
  );
};

export default React.memo(CurrencyContainer);
