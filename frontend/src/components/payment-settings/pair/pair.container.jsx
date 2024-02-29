import React, { createContext } from "react";
import { useFilter } from "../../hooks/filter.hook";
import PairFilter from "./pair-filter.component";
import PairList from "./pair-list.component";
import PairForm from "./pair-form.component";

export const PairFilterContext = createContext();

const PairContainer = () => {
  const [filter, handleClearFilter, handleChangeFilter] = useFilter("p");

  return (
    <PairFilterContext.Provider value={{ filter, handleClearFilter, handleChangeFilter }}>
      <PairForm />
      <PairFilter />
      <PairList />
    </PairFilterContext.Provider>
  )

};

export default PairContainer;