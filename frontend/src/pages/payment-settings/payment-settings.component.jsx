import React from "react";
import Tabs, { TabPane } from "rc-tabs";
import { useApolloClient } from "@apollo/client";

import PairUnitContainer from "../../components/payment-settings/pair-unit/pair-unit.container";
import PairContainer from "../../components/payment-settings/pair/pair.container";
import Can from "../../components/can/can.component";
import { Helmet } from "react-helmet-async";
import AlertMessage from "../../components/alert/alert.component";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledPaymentSettingsWrapper } from "./styled-payment-settings";
import { StyledMainTitle } from "../../components/styles/styled-title";

import { GET_USER_CACHE_DETAILS } from "../../graphql/queries/user.query";
import { paymentSettings } from "../../rbac-consts";

const PaymentSettingsPage = () => {

  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_CACHE_DETAILS
  });

  return (
    <Can
      role={userRole}
      perform={paymentSettings.READ}
      yes={() => (
        <StyledContainer>
          <Helmet>
            <title>Payment settings | BuyCoin.Cash</title>
          </Helmet>
          <StyledPaymentSettingsWrapper>
            <StyledMainTitle mb="25" size="24">
              Payment settings
            </StyledMainTitle>
            <Tabs
              defaultActiveKey="pair"
              tabPosition="top"
              className="default-tabs default-tabs-top"
            >
              <TabPane tab="Payment systems" key="pairUnit">
                <PairUnitContainer />
              </TabPane>
              <TabPane tab="Payment pairs" key="pair">
                <PairContainer />
              </TabPane>
            </Tabs>
          </StyledPaymentSettingsWrapper>
        </StyledContainer>
      )}
      no={() => <AlertMessage center margin="50px auto" type="error" message="Access denied" />}
    />
  );
};

export default PaymentSettingsPage;