import React, { createContext } from "react";
import { useHistory } from "react-router-dom";
import { useApolloClient } from "@apollo/client";

import { Helmet } from "react-helmet-async";
import Can from "../../components/can/can.component";
import RequisitionFilter from "../../components/requisition/requisition-list/requisition-filter.component";
import RequisitionList from "../../components/requisition/requisition-list/requisition-list.component";

import { StyledRequisitionListWrapper } from "../../components/requisition/requisition-list/styled-requisition-list";
import { StyledMainTitle } from "../../components/styles/styled-title";
import { StyledContainer } from "../../components/styles/styled-container";

import { GET_USER_CACHE_DETAILS } from "../../graphql/queries/user.query";
import { useFilter } from "../../components/hooks/filter.hook";
import { requisition } from "../../rbac-consts";

export const RequisitionFilterContext = createContext();

const RequisitionPage = () => {
  const client = useApolloClient();

  const [filter, handleClearFilter, handleChangeFilter] = useFilter();

  const { userRole } = client.readQuery({
    query: GET_USER_CACHE_DETAILS,
  });

  return (
    <Can
      role={userRole}
      perform={requisition.READ}
      yes={() => (
        <StyledContainer>
          <Helmet>
            <title>Requisition list | BuyCoin.Cash</title>
          </Helmet>
          <StyledRequisitionListWrapper role={userRole}>
            <StyledMainTitle mb="25" size="24">
              Requisitions
            </StyledMainTitle>
            <RequisitionFilterContext.Provider
              value={{ filter, handleClearFilter, handleChangeFilter }}
            >
              <RequisitionFilter />
              <RequisitionList />
            </RequisitionFilterContext.Provider>
          </StyledRequisitionListWrapper>
        </StyledContainer>
      )}
      no={() => <div>Access denied</div>}
    />
  );
};

export default React.memo(RequisitionPage);
