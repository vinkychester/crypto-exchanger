import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { NavLink } from "react-router-dom";

import FeedbackMessagesItem from "./feedback-messages-item.component";
import FeedbackAnswerForm from "./feedback-answer-form.component";

import { GET_FEEDBACK_MESSAGE_BY_ID } from "../../../graphql/queries/feedback.query";
import { UPDATE_FEEDBACK_MESSAGE_DETAILS } from "../../../graphql/mutations/feedback.mutation";

import { feedbackStatusConst } from "../../../utils/consts.util";

const FeedbackDetailsContainer = ({ id }) => {

  const { data, loading, error, refetch } = useQuery(GET_FEEDBACK_MESSAGE_BY_ID, {
    variables: { id: "/api/feedback_messages/" + id },
    fetchPolicy: "network-only"
  });

  const [updateDetails] = useMutation(UPDATE_FEEDBACK_MESSAGE_DETAILS, {
    onCompleted: () => refetch({ id: "/api/feedback_messages/" + id })
  });

  const closeTicketHandle = () => {
    updateDetails({
      variables: { id: "/api/feedback_messages/" + id, status: feedbackStatusConst.WELL_DONE }
    });
  };

  const restoreTicketHandle = () => {
    updateDetails({
      variables: { id: "/api/feedback_messages/" + id, status: feedbackStatusConst.VIEWED, deleted: false }
    });
  };

  if (loading) return <span>loading</span>;
  if (error) return <span>Error</span>;
  if (!data) return <span>Not found.</span>;

  const { feedbackMessage } = data;
  const { feedbackDetails } = data.feedbackMessage;

  return (
    <>
      <NavLink to="/panel/feedbacks">
        list messages
      </NavLink><br />
      <div>
        {feedbackMessage.status === feedbackStatusConst.VIEWED ?
          <button onClick={closeTicketHandle}>
            Mark as processed
          </button> : feedbackMessage.status === feedbackStatusConst.DELETED ?
            <button onClick={restoreTicketHandle}>
              Restore
            </button>
            : null}
      </div>
      <div>
        <FeedbackMessagesItem feedbackMessage={feedbackMessage} feedbackDetails={feedbackDetails} />
        {feedbackMessage.status === feedbackStatusConst.WELL_DONE ?
          <span>Processed</span> :
          <FeedbackAnswerForm feedbackMessageId={feedbackMessage.id} />}
      </div>
    </>
  );
};

export default React.memo(FeedbackDetailsContainer);