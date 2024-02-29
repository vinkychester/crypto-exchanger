import React, { useState } from "react";
import { useApolloClient, useMutation } from "@apollo/client";
import { GET_USER_CACHE_DETAILS } from "../../graphql/queries/user.query";
import { CREATE_REVIEW } from "../../graphql/mutations/review.mutation";
import { parseApiErrors } from "../../utils/response.util";
import { generateHash } from "../../utils/hash.utils";

const ReviewCreate = () => {
  const clientApollo = useApolloClient();

  const { userId } = clientApollo.readQuery({
    query: GET_USER_CACHE_DETAILS
  });
  const [errors, setErrors] = useState([]);

  const [messageDetails, setMessage] = useState({
    message: "",
    client: `/api/users/${userId}`,
  });

  const [createReview, { loading: mutationLoading }] = useMutation(CREATE_REVIEW, {
    onCompleted: () => {
      setMessage((prevState) => ({
        ...prevState,
        message: ""
      }));
      setErrors([]);
      alert("After moderation, your review will be published on this page. Thanks for your review.");
    },
    onError: ({graphQLErrors}) => setErrors(parseApiErrors(graphQLErrors)),
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    localStorage.setItem(generateHash(userId), value);
    setMessage((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.removeItem(generateHash(userId));
    createReview({ variables: { message, client } });
  };
  const { message, client } = messageDetails;

  return (
    <form onSubmit={handleSubmit}>
      <label>Please leave your review</label>
      <textarea
        name="message"
        placeholder="Review text"
        onChange={handleChange}
      >
        {localStorage.getItem(generateHash(userId)) ? localStorage.getItem(unescape(userId)) : message}
      </textarea>
      {errors.message && <span>{errors.message}</span>}
      <button
        type="submit"
        disabled={mutationLoading}
      >
        Send
      </button>
    </form>
  );

};

export default ReviewCreate;