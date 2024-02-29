import React, { useContext, useState } from "react";

import FilterItemsPerPage from "../../filter-components/filter-items-per-page.component";
import FilterActive from "../../filter-components/filter-active.component";
import FilterPaymentSystem from "../../filter-components/filter-payment-system.component";
import FilterService from "../../filter-components/filter-service.component";
import DelayInputComponent from "../../input-group/delay-input-group";

import { StyledFilterBody, StyledFilterHead, StyledFilterWrapper } from "../../styles/styled-filter";
import { StyledButton } from "../../styles/styled-button";

import { PairFilterContext } from "./pair.container";

const PairFilter = () => {
  const { filter, handleChangeFilter, handleClearFilter } = useContext(PairFilterContext);
  const [hideFilter, setHideFilter] = useState(!Object.keys(filter).length || "upage" in filter || "ppage" in filter);

  const toggleFilter = () => {
    setHideFilter(!hideFilter);
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    handleChangeFilter(name, value.trim());
  };

  const {
    pactive,
    ppayment_system_in,
    ppayment_system_out,
    pcurrency_in,
    pcurrency_out,
    ppercent_gte,
    ppercent_lte,
    pservice_in,
    pservice_out,
    pitemsPerPage
  } = filter;

  return (
    <StyledFilterWrapper>
      <StyledFilterHead>
        <StyledButton color="main" onClick={toggleFilter}>Filter</StyledButton>
        <FilterItemsPerPage
          name="pitemsPerPage"
          value={pitemsPerPage}
          handleChangeFilter={handleChangeFilter}
        />
      </StyledFilterHead>

      <StyledFilterBody hide={hideFilter}>
        <div className="filter-content">
          <FilterActive
            name="pactive"
            value={pactive}
            handleChangeFilter={handleChangeFilter}
          />
          <FilterPaymentSystem
            name="ppayment_system_in"
            value={ppayment_system_in}
            label="Payment system (IN)"
            handleChangeFilter={handleChangeFilter}
          />
          <DelayInputComponent
            label="Currency (IN)"
            type="text"
            id="pcurrency_in"
            name="pcurrency_in"
            handleChange={handleChangeInput}
            value={pcurrency_in ?? ""}
            autoComplete="off"
            debounceTimeout={600}
          />
          <FilterService
            name="pservice_in"
            value={pservice_in}
            label="Service (IN)"
            handleChangeFilter={handleChangeFilter}
          />
          <FilterPaymentSystem
            name="ppayment_system_out"
            value={ppayment_system_out}
            label="Payment System(OUT)"
            handleChangeFilter={handleChangeFilter}
          />
          <DelayInputComponent
            label="Currency (OUT)"
            type="text"
            id="pcurrency_out"
            name="pcurrency_out"
            handleChange={handleChangeInput}
            value={pcurrency_out ?? ""}
            autoComplete="off"
            debounceTimeout={600}
          />
          <FilterService
            name="pservice_uot"
            value={pservice_out}
            label="Service (OUT)"
            handleChangeFilter={handleChangeFilter}
          />
          <DelayInputComponent
            label="Percent from"
            type="number"
            id="ppercent_gte"
            name="ppercent_gte"
            handleChange={handleChangeInput}
            value={ppercent_gte ?? ""}
            autoComplete="off"
            debounceTimeout={600}
          />
          <DelayInputComponent
            label="Percent to"
            type="number"
            id="ppercent_lte"
            name="ppercent_lte"
            handleChange={handleChangeInput}
            value={ppercent_lte ?? ""}
            autoComplete="off"
            debounceTimeout={600}
          />
          <StyledButton onClick={handleClearFilter}>
            Clear filter
          </StyledButton>
        </div>
      </StyledFilterBody>
    </StyledFilterWrapper>
  );
};

export default PairFilter;