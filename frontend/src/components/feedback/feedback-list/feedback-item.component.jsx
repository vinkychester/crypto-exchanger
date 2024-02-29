import React from "react";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";

import { convertTimestampToDate } from "../../../utils/datetime.util";
import { parseUuidIRI } from "../../../utils/response.util";
import { feedbackStatus } from "../../../utils/feedback.utils";

import { UPDATE_FEEDBACK_MESSAGE_DETAILS } from "../../../graphql/mutations/feedback.mutation";
import { feedbackStatusConst } from "../../../utils/consts.util";

const FeedbackItem = ({
  id,
  firstname,
  lastname,
  email,
  createdAt,
  status,
  deleteFeedbackMessage,
  deleteFeedbackMessageEnd
}) => {
  let history = useHistory();

  const [updateDetails] = useMutation(UPDATE_FEEDBACK_MESSAGE_DETAILS, {
    onCompleted: () => {
      window.location.href = `/panel/feedback/details/${parseUuidIRI(id)}`;
    }
  });

  const DetailClick = () => {
    if (status === feedbackStatusConst.NOT_VIEWED) {
      updateDetails({ variables: { id: id, status: feedbackStatusConst.VIEWED } });
    } else {
      history.push(`/panel/feedback/details/${parseUuidIRI(id)}`);
    }
  };
  const deleteFeedbackMessageAction = () => {
    if (status === feedbackStatusConst.DELETED) {
      deleteFeedbackMessageEnd({
        variables: { id: id }
      });
    } else {
      deleteFeedbackMessage({
        variables: { id: id, deleted: true, status: feedbackStatusConst.DELETED }
      });
    }
  };

  return (
    <>
      <tr>
        <td>{firstname} {lastname} <p><small>{email}</small></p></td>
        <td>{convertTimestampToDate(createdAt)}</td>
        <td>{feedbackStatus(status)}</td>
        <td>
          <button onClick={DetailClick}>Details</button>
          <br />
          <button onClick={deleteFeedbackMessageAction}>
            {status === feedbackStatusConst.DELETED ? "Delete completely" : "Delete"}
          </button>
        </td>
      </tr>
    </>
  );
};

export default React.memo(FeedbackItem);