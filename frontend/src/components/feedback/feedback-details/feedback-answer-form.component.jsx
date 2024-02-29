import React, { useState } from "react";
import { useMutation } from "@apollo/client";

import { CREATE_FEEDBACK_DETAIL } from "../../../graphql/mutations/feedback.mutation";
import { GET_FEEDBACK_MESSAGE_BY_ID } from "../../../graphql/queries/feedback.query";

import { author } from "../../../utils/feedback.utils";

const FeedbackAnswerForm = ({ feedbackMessageId }) => {
  const [message, setMessage] = useState();
  const [error, setError] = useState("");

  const [createFeedbackDetail, { loading }] = useMutation(CREATE_FEEDBACK_DETAIL, {
    onCompleted: () => {
      setMessage("");
      setError("");
      alert("message send");
    }
  });

  const handleChange = event => {
    const { value } = event.target;
    setMessage(value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (message.length < 3) {
      setError("The message must be at least 3 characters long");
      return false;
    }
    createFeedbackDetail({
      variables: { feedbackMessageId: feedbackMessageId, message, author: author.MANAGER },
      refetchQueries: [{ query: GET_FEEDBACK_MESSAGE_BY_ID, variables: { id: feedbackMessageId } }]
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Write the answer</label>
          <textarea
            name="message"
            placeholder="Your message"
            onChange={handleChange}
            required="required"
          >
          {message}
          </textarea>
          {error && <span>{error}</span>}
        </div>
        <button
          type="submit"
          disabled={loading}
        >
          Send
        </button>
      </form>
    </>
  );
};

export default React.memo(FeedbackAnswerForm);