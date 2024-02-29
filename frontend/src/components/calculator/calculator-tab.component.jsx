import React, { useContext, createContext, useState, useCallback } from "react";

import CalculatorNavigation from "./calculator-navigation.component";
import CalculatorContent from "./calculator-content.component";

import { StyledCalculatorTabWrapper, StyledTabTitle } from "./styled-calculator";

import {
  CalculatorContext,
  CalculatorTabContext,
} from "./calculator.container";

const CalculatorFooter = React.lazy(() => import("./calculator-footer.component"));

export const CalculatorContentContext = createContext();

const CalculatorTab = ({ label }) => {
  const { pair, handleChangeTabs } = useContext(CalculatorContext);
  const { direction, tab } = useContext(CalculatorTabContext);

  // const [tab, setTab] = useState(direction === "payment" ? "bank" : "coin");
  const [exchangeItem, setExchangeItem] = useState(undefined);

  const handleChangeTab = useCallback(
    (value) => {
      setExchangeItem(undefined);
      handleChangeTabs(direction, value);
    },
    [tab]
  );

  const handleChangeExchangeItem = useCallback(
    (node) => {
      setExchangeItem(node);
    },
    [exchangeItem]
  );

  return (
    <StyledCalculatorTabWrapper className={`calculator__tab calculator_${direction}`}>
      <StyledTabTitle>{label}:</StyledTabTitle>
      <CalculatorContentContext.Provider
        value={{ exchangeItem, handleChangeTab, handleChangeExchangeItem }}
      >
        <CalculatorNavigation />
        <CalculatorContent />
      </CalculatorContentContext.Provider>
      {pair && <CalculatorFooter />}
    </StyledCalculatorTabWrapper>
  );
};

export default React.memo(CalculatorTab);
