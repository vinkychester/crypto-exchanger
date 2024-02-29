import React, { createContext } from "react";
import { useApolloClient } from "@apollo/client";
import { Helmet } from "react-helmet-async";

import AlertMessage from "../../components/alert/alert.component";
import Can from "../../components/can/can.component";
import CardVerificationFilter from "../../components/card-verification/card-verification-list/card-verification-filter.component";
import CardVerificationForm from "../../components/card-verification/card-verification-list/card-verification-form.component";
import CardVerificationList from "../../components/card-verification/card-verification-list/card-verification-list.component";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledCardVerificationListWrapper } from "../../components/card-verification/card-verification-list/styled-card-verification-list";
import { StyledMainTitle } from "../../components/styles/styled-title";

import { GET_USER_CACHE_DETAILS } from "../../graphql/queries/user.query";
import { useFilter } from "../../components/hooks/filter.hook";
import { cardVerification } from "../../rbac-consts";

export const CardVerificationFilterContext = createContext();

const CardVerificationPage = () => {
  const client = useApolloClient();
  const { userRole } = client.readQuery({ query: GET_USER_CACHE_DETAILS });

  const [filter, handleClearFilter, handleChangeFilter] = useFilter();

  return (
    <Can
      role={userRole}
      perform={cardVerification.READ}
      yes={() => (
        <StyledContainer>
          <Helmet>
            <title>Card verification | BuyCoin.Cash</title>
          </Helmet>
          <StyledCardVerificationListWrapper>
            <StyledMainTitle mb="25" size="24">
              Card verification
            </StyledMainTitle>
            <CardVerificationFilterContext.Provider
              value={{ filter, handleClearFilter, handleChangeFilter }}
            >
              <Can
                role={userRole}
                perform={cardVerification.CREATE}
                yes={() => <CardVerificationForm />}
              />
              <CardVerificationFilter />
              <CardVerificationList />
            </CardVerificationFilterContext.Provider>
          </StyledCardVerificationListWrapper>
        </StyledContainer>
      )}
      no={() => <AlertMessage center margin="50px auto" type="error" message="Access denied" />}
    />
  );
};

export default React.memo(CardVerificationPage);
