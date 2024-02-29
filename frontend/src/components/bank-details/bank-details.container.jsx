import React, { createContext } from "react";
import { useFilter } from "../hooks/filter.hook";
import BankDetailsForm from "./bank-details-form.component";
import BankDetailsFilter from "./bank-details-filter.component";
import BankDetailsList from "./bank-details-list.component";
import { Helmet } from "react-helmet-async";

import { StyledContainer } from "../styles/styled-container";
import { StyledBankDetailsWrapper } from "./styled-bank-details";
import { StyledMainTitle } from "../styles/styled-title";

export const BankDetailsFilterContext = createContext();

const BankDetailsContainer = () => {
  const [filter, handleClearFilter, handleChangeFilter] = useFilter();

  return (
    <StyledContainer>
      <Helmet>
        <title>Bank details | BuyCoin.Cash</title>
      </Helmet>
      <StyledBankDetailsWrapper>
        <StyledMainTitle mb="25" size="24">
          Bank details
        </StyledMainTitle>
        <BankDetailsFilterContext.Provider value={{ filter, handleClearFilter, handleChangeFilter }}>
          <BankDetailsForm />
          <BankDetailsFilter />
          <BankDetailsList />
        </BankDetailsFilterContext.Provider>
      </StyledBankDetailsWrapper>
    </StyledContainer>
  );
};

export default React.memo(BankDetailsContainer);