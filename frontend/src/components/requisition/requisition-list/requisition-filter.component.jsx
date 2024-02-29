import React, { useContext, useState } from "react";
import { useApolloClient } from "@apollo/client";
import { NavLink } from "react-router-dom";
import DatePicker from "react-date-picker";

import Can from "../../can/can.component";
import FilterItemsPerPage from "../../filter-components/filter-items-per-page.component";
import FilterUserDetails from "../../filter-components/filter-user-details.component";
import FilterRequisitionStatus from "./filter-components/filter-requisition-status.component";
import DelayInputComponent from "../../input-group/delay-input-group";

import { StyledFilterBody, StyledFilterHead, StyledFilterWrapper } from "../../styles/styled-filter";
import { StyledButton } from "../../styles/styled-button";

import { GET_USER_CACHE_DETAILS } from "../../../graphql/queries/user.query";
import { RequisitionFilterContext } from "../../../pages/requisition/requisition.component";
import { calculator, requisition } from "../../../rbac-consts";
import { handleChange } from "../../../utils/filter.util";
import { convertDateToLocalDateTime, convertLocalDateTimeToFormat } from "../../../utils/datetime.util";

const RequisitionFilter = () => {
  const format = "DD-MM-YYYY";
  const client = useApolloClient();

  const { userRole } = client.readQuery({ query: GET_USER_CACHE_DETAILS });

  const { filter, handleChangeFilter, handleClearFilter, totalCount } = useContext(RequisitionFilterContext);
  const [hideFilter, setHideFilter] = useState(!Object.keys(filter).length || 'page' in filter || 'status' in filter  );

  const toggleFilter = () => {
    setHideFilter(!hideFilter);
  };

  const {
    id,
    status,
    payment_system,
    currency,
    wallet,
    payment_amount_gte,
    payment_amount_lte,
    payout_amount_gte,
    payout_amount_lte,
    date_gte,
    date_lte,
    itemsPerPage,
    ...props
  } = filter;

  console.log(convertDateToLocalDateTime(date_gte));

  return (
    <StyledFilterWrapper className="requisition-filter">
      <StyledFilterHead className="requisition-filter__head">
        <Can
          role={userRole}
          perform={calculator.EXCHANGE}
          yes={() => <NavLink to="/"><StyledButton as="span" color="main">Create an order</StyledButton></NavLink>}
        />
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
          <DelayInputComponent
            type="text"
            name="id"
            label="ID"
            handleChange={(e) => handleChange(e, handleChangeFilter)}
            value={id ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <Can
            role={userRole}
            perform={requisition.CLIENT_DETAILS}
            yes={() => (
              <FilterUserDetails
                {...props}
                handleChangeFilter={handleChangeFilter}
              />
            )}
          />
          <FilterRequisitionStatus
            value={status}
            handleChangeFilter={handleChangeFilter}
          />
          <DelayInputComponent
            type="text"
            name="payment_amount_gte"
            label="Payment amount from"
            handleChange={(e) => handleChange(e, handleChangeFilter)}
            value={payment_amount_gte ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="text"
            name="payment_amount_lte"
            label="Payment amount to"
            handleChange={(e) => handleChange(e, handleChangeFilter)}
            value={payment_amount_lte ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="text"
            name="payout_amount_gte"
            label="Payout amount from"
            handleChange={(e) => handleChange(e, handleChangeFilter)}
            value={payout_amount_gte ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="text"
            name="payout_amount_lte"
            label="Payout amount to"
            handleChange={(e) => handleChange(e, handleChangeFilter)}
            value={payout_amount_lte ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          {/* datetime */}
          <DatePicker
            format="dd-MM-y"
            id="date_gte"
            name="date_gte"
            className="date-input"
            onChange={(date) => 
              handleChangeFilter(
                "date_gte",
                convertLocalDateTimeToFormat(date, format)
              )
            }
            // value={date_gte ? convertDateToLocalDateTime(date_gte) : ""}
          />
          <DatePicker
            format="dd-MM-y"
            id="date_lte"
            name="date_lte"
            className="date-input"
            onChange={(date) =>
              handleChangeFilter(
                "date_lte",
                convertLocalDateTimeToFormat(date, format)
              )
            }
            value={date_lte ? convertDateToLocalDateTime(date_lte) : ""}
          />
          <StyledButton onClick={handleClearFilter}>Clear filter</StyledButton>
        </div>
      </StyledFilterBody>
    </StyledFilterWrapper>
  );
};

export default React.memo(RequisitionFilter);
