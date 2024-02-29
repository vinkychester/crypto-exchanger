import React, { useContext, useState } from "react";
import { useApolloClient } from "@apollo/client";
import DatePicker from "react-date-picker";

import Can from "../../can/can.component";
import FilterItemsPerPage from "../../filter-components/filter-items-per-page.component";
import FilterUserDetails from "../../filter-components/filter-user-details.component";
import FilterCardVerificationStatus from "./filter-components/filter-card-verification-status.component";
import DelayInputComponent from "../../input-group/delay-input-group";

import { StyledFilterBody, StyledFilterHead, StyledFilterWrapper } from "../../styles/styled-filter";
import { StyledButton } from "../../styles/styled-button";

import { GET_USER_CACHE_DETAILS } from "../../../graphql/queries/user.query";
import { CardVerificationFilterContext } from "../../../pages/card-verification/card-verification.component";
import { handleChange } from "../../../utils/filter.util";
import { cardVerification } from "../../../rbac-consts";

const CardVerificationFilter = () => {
  const format = "DD-MM-YYYY";
  const client = useApolloClient();

  const { userRole } = client.readQuery({ query: GET_USER_CACHE_DETAILS });
  const { filter, handleChangeFilter, handleClearFilter } = useContext(CardVerificationFilterContext);

  const [hideFilter, setHideFilter] = useState(!Object.keys(filter).length || "page" in filter || "status" in filter);

  const toggleFilter = () => {
    setHideFilter(!hideFilter);
  };

  const { cardMask, status, date_gte, date_lte, itemsPerPage, ...props } = filter;

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
          <DelayInputComponent
            type="text"
            name="cardMask"
            label="Номер карты"
            handleChange={(e) => handleChange(e, handleChangeFilter)}
            value={cardMask ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <Can
            role={userRole}
            perform={cardVerification.FILTER_CLIENT_DETAILS}
            yes={() => (
              <FilterUserDetails
                {...props}
                handleChangeFilter={handleChangeFilter}
              />
            )}
          />
          <FilterCardVerificationStatus
            value={status}
            handleChangeFilter={handleChangeFilter} 
          />
          <StyledButton onClick={handleClearFilter}>Clear filter</StyledButton>
        </div>
      </StyledFilterBody>
    </StyledFilterWrapper>
  );
};

export default React.memo(CardVerificationFilter);