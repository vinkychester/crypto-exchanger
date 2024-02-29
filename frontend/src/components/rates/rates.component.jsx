import React, { useState, createContext, useCallback } from "react";

import RatesPayment from "./rates-payment.component";
import RatesReserve from "./rates-reserve.component";
import RatesList from "./rates-list.component";

import { StyledChooseWrapper } from "./styled-rates";

export const RatesContext = createContext();

const INITIAL_STATE = { inmin: 0, inmax: 0, outmin: 0, outmax: 0 };

const Rates = () => {
  const [selected, setSelected] = useState({});
  const [reserve, setReserve] = useState(INITIAL_STATE);

  const handleChangeSelected = useCallback(
    (value) => {
      // setReserve(INITIAL_STATE);
      setSelected(value);
    },
    [selected]
  );

  const handleChangeReserve = useCallback(
    (obj) => {
      setReserve((prevState) => ({
        ...prevState,
        ...obj,
      }));
    },
    [reserve]
  );

  return (
    <RatesContext.Provider
      value={{ selected, reserve, handleChangeSelected, handleChangeReserve }}
    >
      <StyledChooseWrapper>
        <RatesPayment />
        {Object.keys(selected).length !== 0 && <RatesReserve />}
      </StyledChooseWrapper>
      {Object.keys(selected).length !== 0 && <RatesList />}
    </RatesContext.Provider>
  );
};

export default React.memo(Rates);
