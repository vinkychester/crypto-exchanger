import React, { createContext } from "react";
import { useApolloClient } from "@apollo/client";

import ReviewPanelFilter from "../../components/review/review-panel/review-panel-filter.component";
import ReviewPanelList from "../../components/review/review-panel/review-panel-list.component";
import { useFilter } from "../../components/hooks/filter.hook";
import Can from "../../components/can/can.component";

import { GET_USER_CACHE_DETAILS } from "../../graphql/queries/user.query";

import { reviews } from "../../rbac-consts";

export const ReviewAdminFilterContext = createContext();

const ReviewPanelPage = () => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_CACHE_DETAILS
  });

  const [filter, handleClearFilter, handleChangeFilter] = useFilter();

  return (
    <Can
      role={userRole}
      perform={reviews.PANEL_READ}
      yes={() => (
        <ReviewAdminFilterContext.Provider value={{ filter, handleClearFilter, handleChangeFilter }}>
          <h1>review admin</h1>
          <ReviewPanelFilter />
          <ReviewPanelList />
        </ReviewAdminFilterContext.Provider>
      )}
      no={() => <h1>no access</h1>}
    />
  );
};

export default ReviewPanelPage;