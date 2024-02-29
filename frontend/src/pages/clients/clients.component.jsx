import React from "react";
import { useApolloClient } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import Tabs, { TabPane } from "rc-tabs/es";

import Can from "../../components/can/can.component";
import ClientsListContainer from "../../components/clients/clients-list/clients-list.container";
import AlertMessage from "../../components/alert/alert.component";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledClientListWrapper } from "../../components/clients/clients-list/styled-client-list";
import { StyledMainTitle } from "../../components/styles/styled-title";

import { GET_USER_CACHE_DETAILS } from "../../graphql/queries/user.query";
import { clients } from "../../rbac-consts";

const ClientsPage = () => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_CACHE_DETAILS
  });

  return (
    <Can
      role={userRole}
      perform={clients.READ}
      yes={() => (
        <StyledContainer>
          <Helmet>
            <title>Clients | BuyCoin.Cash</title>
          </Helmet>
          <StyledClientListWrapper>
            <StyledMainTitle mb="25" size="24">
              Clients
            </StyledMainTitle>
            <Tabs
              defaultActiveKey="activeClients"
              tabPosition="top"
              className="default-tabs default-tabs-top"
            >
              <TabPane tab="Clients" key="activeClients">
                <ClientsListContainer sign="a" />
                {/* <ClientContainer sign="a" /> */}
              </TabPane>
              <TabPane tab="Banned clients" key="blockClients">
                {/* <ClientContainer sign="b" /> */}
              </TabPane>
            </Tabs>
          </StyledClientListWrapper>
        </StyledContainer>
      )}
      no={() => <AlertMessage center margin="50px auto" type="error" message="Access denied" />}
    />
  );
};

export default ClientsPage;