import React, { useContext, useState } from "react";

import { BankDetailsFilterContext } from "./bank-details.container";
import FilterPaymentSystem from "../filter-components/filter-payment-system.component";
import FilterItemsPerPage from "../filter-components/filter-items-per-page.component";
import FilterDirection from "../payment-settings/pair-unit/filter/filter-direction.component";
import DelayInputComponent from "../input-group/delay-input-group";

import { StyledFilterBody, StyledFilterHead, StyledFilterWrapper } from "../styles/styled-filter";
import { StyledButton } from "../styles/styled-button";

import { handleChange } from "../../utils/filter.util";

const BankDetailsFilter = () => {
  const { filter, handleChangeFilter, handleClearFilter } = useContext(BankDetailsFilterContext);
  const [hideFilter, setHideFilter] = useState(!Object.keys(filter).length || "page" in filter);

  const toggleFilter = () => {
    setHideFilter(!hideFilter);
  };

  const { payment_system, itemsPerPage, direction, currency, title, value } = filter;

  return (
    <StyledFilterWrapper>
      <StyledFilterHead>
        <StyledButton color="main" onClick={toggleFilter}>
          Filter
        </StyledButton>
        <FilterItemsPerPage
          name="itemsPerPage"
          value={itemsPerPage}
          handleChangeFilter={handleChangeFilter}
        />
      </StyledFilterHead>
      <StyledFilterBody hide={hideFilter}>
        <div className="filter-content">
          <FilterPaymentSystem
            name="payment_system"
            value={payment_system}
            handleChangeFilter={handleChangeFilter}
            label="Payment System"
          />
          <FilterDirection
            name="direction"
            value={direction}
            handleChangeFilter={handleChangeFilter}
          />
          <DelayInputComponent
            label="Currency"
            type="text"
            id="currency"
            name="currency"
            handleChange={(e) => handleChange(e, handleChangeFilter)}
            value={currency ?? ""}
            autoComplete="off"
            debounceTimeout={600}
          />
          <DelayInputComponent
            label="Name"
            type="text"
            id="title"
            name="title"
            handleChange={(e) => handleChange(e, handleChangeFilter)}
            value={title ?? ""}
            autoComplete="off"
            debounceTimeout={600}
          />
          <DelayInputComponent
            label="Value"
            type="text"
            id="value"
            name="value"
            handleChange={(e) => handleChange(e, handleChangeFilter)}
            value={value ?? ""}
            autoComplete="off"
            debounceTimeout={600}
          />
          <StyledButton onClick={handleClearFilter}>Clear filter</StyledButton>
        </div>
      </StyledFilterBody>
    </StyledFilterWrapper>
  );
};

export default React.memo(BankDetailsFilter);