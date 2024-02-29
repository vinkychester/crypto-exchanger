import React, { createContext } from "react";
import { useApolloClient } from "@apollo/client";

import { useFilter } from "../../components/hooks/filter.hook";
import Can from "../../components/can/can.component";
import FeedbackFilter from "../../components/feedback/feedback-list/feedback-filter.component";
import FeedbackList from "../../components/feedback/feedback-list/feedback-list.component";

import { feedbacks } from "../../rbac-consts";

import { GET_USER_CACHE_DETAILS } from "../../graphql/queries/user.query";

export const FeedbackFilterContext = createContext();

const FeedbackPage = () => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_CACHE_DETAILS
  });

  const [filter, handleClearFilter, handleChangeFilter] = useFilter();

  return (
    <Can
      role={userRole}
      perform={feedbacks.PANEL_READ}
      yes={() => (
        <FeedbackFilterContext.Provider value={{ filter, handleClearFilter, handleChangeFilter }}>
          <FeedbackFilter />
          <FeedbackList />
        </FeedbackFilterContext.Provider>
      )}
    />
  );
};

export default React.memo(FeedbackPage);