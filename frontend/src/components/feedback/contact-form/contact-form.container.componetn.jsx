import React, { useState } from "react";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";

import { parseApiErrors } from "../../../utils/response.util";

import { CREATE_FEEDBACK_MESSAGE } from "../../../graphql/mutations/feedback.mutation";
import { GET_USER_CACHE_DETAILS, GET_USER_DETAILS } from "../../../graphql/queries/user.query";

const ContactFormContainer = () => {
  const client = useApolloClient();

  const { userId, userRole } = client.readQuery({
    query: GET_USER_CACHE_DETAILS,
  });

  const INITIAL_STATE = { firstname: "", lastname: "", email: "", message: "" };
  const [feedbackMessage, setFeedbackMessage] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState([]);

  const {} = useQuery(GET_USER_DETAILS, {
    variables: { id: `/api/users/${userId}` },
    fetchPolicy: "network-only",
    skip: userRole !== "client",
    onCompleted: ({ user }) => {
      const { firstname, lastname, email } = user;
      setFeedbackMessage((prevState) => ({
        ...prevState,
        firstname, lastname, email
      }));
    },
  });

  const [createFeedbackMessage, { loading }] = useMutation(
    CREATE_FEEDBACK_MESSAGE,
    {
      onCompleted: () => {
        setFeedbackMessage((prevState) => ({
          ...prevState,
          message: "",
        }));
        setErrors([]);
        alert("your message will be processed");
      },
      onError: ({ graphQLErrors }) => {
        setErrors(parseApiErrors(graphQLErrors));
        if (errors.internal) {
          alert(errors.internal);
        }
      },
    }
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFeedbackMessage((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createFeedbackMessage({
      variables: { ...feedbackMessage },
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="firstname"
            onChange={handleChange}
            value={feedbackMessage.firstname}
            autoComplete="off"
            required='required'
          />
          {errors.firstname && <span>{errors.firstname}</span>}
        </div>
        <div>
          <label>Last Name</label>
          <input
            type="text"
            name="lastname"
            onChange={handleChange}
            value={feedbackMessage.lastname}
            autoComplete="off"
            required='required'
          />
          {errors.lastname && <span>{errors.lastname}</span>}
        </div>
        <div>
          <label>E-mail</label>
          <input
            type="text"
            name="email"
            onChange={handleChange}
            value={feedbackMessage.email}
            autoComplete="off"
            required='required'
          />
          {errors.email && <span>{errors.email}</span>}
        </div>
        <div>
          <label>Message</label>
          <textarea
            name="message"
            placeholder="Your message"
            onChange={handleChange}
            required="required"
          >
          {feedbackMessage.message}
          </textarea>
          {errors.message && <span>{errors.message}</span>}
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
          >
            Send
          </button>
        </div>
      </form>
    </>
  );
}

export default React.memo(ContactFormContainer);