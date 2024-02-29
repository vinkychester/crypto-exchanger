import React, { useContext, useState } from "react";

import FilterActive from "../../filter-components/filter-active.component";
import FilterPaymentSystem from "../../filter-components/filter-payment-system.component";
import FilterService from "../../filter-components/filter-service.component";
import FilterDirection from "./filter/filter-direction.component";
import FilterItemsPerPage from "../../filter-components/filter-items-per-page.component";
import FilterTabs from "./filter/filter-tab.component";
import DelayInputComponent from "../../input-group/delay-input-group";

import { StyledButton } from "../../styles/styled-button";
import {
  StyledFilterBody,
  StyledFilterHead,
  StyledFilterWrapper,
} from "../../styles/styled-filter";

import { PairUnitFilterContext } from "./pair-unit.container";

const PairUnitFilter = () => {
  const { filter, handleChangeFilter, handleClearFilter } = useContext(PairUnitFilterContext);
  const [hideFilter, setHideFilter] = useState(
    !Object.keys(filter).length || "upage" in filter || "ppage" in filter
  );

  const toggleFilter = () => {
    setHideFilter(!hideFilter);
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    handleChangeFilter(name, value.trim());
  };

  const {
    uactive,
    ucurrency,
    upayment_system,
    uservice,
    udirection,
    upercent_gte,
    upercent_lte,
    uconstant_gte,
    uconstant_lte,
    umin_gte,
    umin_lte,
    umax_gte,
    umax_lte,
    upriority_gte,
    upriority_lte,
    upayment_tab,
    uitemsPerPage,
  } = filter;

  return (
    <StyledFilterWrapper>
      <StyledFilterHead>
        <StyledButton color="main" onClick={toggleFilter}>
          Filter
        </StyledButton>
        <FilterItemsPerPage
          name="uitemsPerPage"
          value={uitemsPerPage}
          handleChangeFilter={handleChangeFilter}
        />
      </StyledFilterHead>
      <StyledFilterBody hide={hideFilter}>
        <div className="filter-content">
          <DelayInputComponent
            label="Currency"
            type="text"
            id="currency"
            name="ucurrency"
            handleChange={handleChangeInput}
            value={ucurrency ?? ""}
            autoComplete="off"
            debounceTimeout={600}
          />
          <FilterActive
            name="uactive"
            value={uactive}
            handleChangeFilter={handleChangeFilter}
          />
          <FilterPaymentSystem
            name="upayment_system"
            value={upayment_system}
            label="Payment System"
            handleChangeFilter={handleChangeFilter}
          />
          <FilterService
            name="uservice"
            value={uservice}
            label="Service"
            handleChangeFilter={handleChangeFilter}
          />
          <FilterDirection
            name="udirection"
            value={udirection}
            handleChangeFilter={handleChangeFilter}
          />
          <DelayInputComponent
            label="Percent from"
            type="number"
            id="upercent_gte"
            name="upercent_gte"
            handleChange={handleChangeInput}
            value={upercent_gte ?? ""}
            autoComplete="off"
            debounceTimeout={600}
          />
          <DelayInputComponent
            label="Percent to"
            type="number"
            id="upercent_lte"
            name="upercent_lte"
            handleChange={handleChangeInput}
            value={upercent_lte ?? ""}
            autoComplete="off"
            debounceTimeout={600}
          />
          <DelayInputComponent
            label="Constant from"
            type="number"
            id="uconstant_gte"
            name="uconstant_gte"
            handleChange={handleChangeInput}
            value={uconstant_gte ?? ""}
            autoComplete="off"
            debounceTimeout={600}
          />
          <DelayInputComponent
            label="Constant to"
            type="number"
            id="uconstant_lte"
            name="uconstant_lte"
            handleChange={handleChangeInput}
            value={uconstant_lte ?? ""}
            autoComplete="off"
            debounceTimeout={600}
          />
          <DelayInputComponent
            label="Min from"
            type="number"
            id="umin_gte"
            name="umin_gte"
            handleChange={handleChangeInput}
            value={umin_gte ?? ""}
            autoComplete="off"
            debounceTimeout={600}
          />
          <DelayInputComponent
            label="Min to"
            type="number"
            id="umin_lte"
            name="umin_lte"
            handleChange={handleChangeInput}
            value={umin_lte ?? ""}
            autoComplete="off"
            debounceTimeout={600}
          />
          <DelayInputComponent
            label="Max from"
            type="number"
            id="umax_gte"
            name="umax_gte"
            handleChange={handleChangeInput}
            value={umax_gte ?? ""}
            autoComplete="off"
            debounceTimeout={600}
          />
          <DelayInputComponent
            label="Max to"
            type="number"
            id="umax_lte"
            name="umax_lte"
            handleChange={handleChangeInput}
            value={umax_lte ?? ""}
            autoComplete="off"
            debounceTimeout={600}
          />
          <DelayInputComponent
            label="Priority from"
            type="number"
            id="upriority_gte"
            name="upriority_gte"
            handleChange={handleChangeInput}
            value={upriority_gte ?? ""}
            autoComplete="off"
            debounceTimeout={600}
          />
          <DelayInputComponent
            label="Priority to"
            type="number"
            id="upriority_lte"
            name="upriority_lte"
            handleChange={handleChangeInput}
            value={upriority_lte ?? ""}
            autoComplete="off"
            debounceTimeout={600}
          />
          <FilterTabs
            name="upayment_tab"
            value={upayment_tab}
            handleChangeFilter={handleChangeFilter}
          />
          <StyledButton onClick={handleClearFilter}>Clear filter</StyledButton>
        </div>
      </StyledFilterBody>
    </StyledFilterWrapper>
  );
};

export default PairUnitFilter;
