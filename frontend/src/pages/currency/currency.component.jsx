import React from "react";
import { useApolloClient } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import Tabs, { TabPane } from "rc-tabs";

import Can from "../../components/can/can.component";
import CurrencyContainer from "../../components/currency/currency.container"

import { GET_USER_CACHE_DETAILS } from "../../graphql/queries/user.query";
import { currency } from "../../rbac-consts";

const CurrencyPage = () => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_CACHE_DETAILS,
  });

  return (
    <Can
      role={userRole}
      perform={currency.READ}
      yes={() => (
        <>
          <Helmet>
            <title>Список валют - Coin24</title>
          </Helmet>
          <>
            <Tabs
              defaultActiveKey="currency"
              tabPosition="top"
              className="default-tabs default-tabs-top"
            >
              <TabPane tab="Currency" key="currency">
                <CurrencyContainer tag="CURRENCY" />
              </TabPane>
              <TabPane tab="Crypto" key="crypto">
                <CurrencyContainer tag="CRYPTO" />
              </TabPane>
            </Tabs>
          </>
        </>
      )}
      no={() => <p>no access</p>}
    />
  );
};

export default React.memo(CurrencyPage);
