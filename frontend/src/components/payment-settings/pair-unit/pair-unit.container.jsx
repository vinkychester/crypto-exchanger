import React, { createContext } from "react";

import PairUnitMultiply from "./pair-unit-multiply.component";
import PairUnitFilter from "./pair-unit-filter.component";
import PairUnitList from "./pair-unit-list.component";
import { useFilter } from "../../hooks/filter.hook";

export const PairUnitFilterContext = createContext();

const PairUnitContainer = () => {

  const [filter, handleClearFilter, handleChangeFilter] = useFilter("u");

  return (
    <PairUnitFilterContext.Provider value={{ filter, handleClearFilter, handleChangeFilter }}>
      {/*<PairUnitMultiply />*/}
      <PairUnitFilter />
      <PairUnitList />
    </PairUnitFilterContext.Provider>
  );

};

export default PairUnitContainer;