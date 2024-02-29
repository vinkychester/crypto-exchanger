import React, { useState, createContext, useContext } from "react";
import { useQuery, useApolloClient } from "@apollo/client";
import Tabs, { TabPane } from "rc-tabs/es";

import AccountUserInformation from "../../components/account/account-user-information.component";
import AccountChangePassword from "../../components/account/account-change-password.component";
import AccountConfigSecurity from "../../components/account/account-config-security.component";

import { GET_USER_ACCOUNT_DETAILS } from "../../graphql/queries/account.query";
import { GET_USER_CACHE_DETAILS } from "../../graphql/queries/user.query";

export const UserAccountContext = createContext();

const Account = () => {
  const client = useApolloClient();

  const { userId, userRole } = client.readQuery({
    query: GET_USER_CACHE_DETAILS
  });

  const [firstLogin, setFirstLogin] = useState(false);
  let activeTab =
    firstLogin && userRole === "client" ? "changePassword" : "personalData";
  const { data, loading, error } = useQuery(GET_USER_ACCOUNT_DETAILS,
    {
      variables: { id: `/api/users/${userId}` },
      fetchPolicy: "network-only"
    }
  );

  if (loading) return "loading...";
  if (error) return "Error";
  if (!data) return "No users";

  const user = data['user'];

  return (
    <UserAccountContext.Provider value={{ user }}>
      <Tabs
        defaultActiveKey={activeTab}
        tabPosition="left"
        className="default-tabs default-tabs-left"
      >
        <TabPane tab="Personal data" key="personalData">
          <AccountUserInformation />
        </TabPane>
        {userRole === "client" && (
          <>
            <TabPane tab="Change Password" key="changePassword">
              <AccountChangePassword
                firstLogin={firstLogin}
                setFirstLogin={setFirstLogin}
              />
            </TabPane>
            <TabPane tab="Config Security" key="configSecurity">
              <AccountConfigSecurity />
            </TabPane>
          </>
        )}
      </Tabs>
    </UserAccountContext.Provider>
  );
};

export default React.memo(Account);