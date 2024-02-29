import React from "react";

import { convertTimestampToDate } from "../../../utils/datetime.util";
import { authorType } from "../../../utils/feedback.utils";

const FeedbackMessagesItem = ({ feedbackMessage, feedbackDetails }) => {

  return (
    <>
      <div>{feedbackMessage.firstname} {feedbackMessage.lastname}</div>
      <div><small>{feedbackMessage.email}</small></div>
      <div>{feedbackMessage.message}</div>
      <div><small>{convertTimestampToDate(feedbackMessage.createdAt)}</small></div>
      {feedbackDetails.map(({ ...message }, key) => (
        <div key={key}>
          <div>
            {authorType(message.author)}
          </div>
          <div>
            {message.message}
          </div>
          <div>
            {convertTimestampToDate(message.createdAt)}
          </div>
        </div>
      ))}
    </>
  );
};

export default React.memo(FeedbackMessagesItem);