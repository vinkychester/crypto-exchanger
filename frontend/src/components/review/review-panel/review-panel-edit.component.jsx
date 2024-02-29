import React, { useEffect, useState } from "react";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { NavLink } from "react-router-dom";

import { parseApiErrors } from "../../../utils/response.util";
import { convertTimestampToDate } from "../../../utils/datetime.util";

import Can from "../../can/can.component";

import { reviews } from "../../../rbac-consts";

import { GET_USER_CACHE_DETAILS } from "../../../graphql/queries/user.query";
import { GET_REVIEW_BY_ID } from "../../../graphql/queries/review.query";
import { UPDATE_REVIEW_DETAILS } from "../../../graphql/mutations/review.mutation";

const ReviewPanelEdit = ({ match }) => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_CACHE_DETAILS
  });
  const { id } = match.params;
  const [errors, setErrors] = useState([]);
  const [messageDetails, setMessageDetails] = useState({
    message: "",
    reviewId: `/api/reviews/${id}`
  });

  const { data, loading, error } = useQuery(GET_REVIEW_BY_ID, {
    variables: { id: `/api/reviews/${id}` },
    fetchPolicy: "network-only"
  });

  const [updateReview, { loading: mutationLoading }] = useMutation(UPDATE_REVIEW_DETAILS, {
    onCompleted: () => {
      setErrors([]);
      alert("Review edited successfully");
    },
    onError: ({ graphQLErrors }) => setErrors(parseApiErrors(graphQLErrors))
  });

  const handleChange = (event) => {
    const { value } = event.target;
    setMessageDetails((prevState) => ({
      ...prevState,
      message: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateReview({ variables: { id: messageDetails.reviewId, message: messageDetails.message } });
  };

  useEffect(() => {
    if (data) {
      setMessageDetails((prevState) => ({
        ...prevState,
        message: data.review.message
      }));
    }
  }, [data]);

  if (loading) return <span>loading</span>;
  if (error) return <span>Error</span>;
  if (!data) return <span>Not found.</span>;

  const { review } = data;

  return (
    <Can
      role={userRole}
      perform={reviews.EDIT}
      yes={() => (
        <>
          <NavLink to="/panel/reviews">
            List of reviews
          </NavLink>
          <span>{" "}review from {review.client.firstname} {review.client.lastname} {" "}</span>
          <span>{convertTimestampToDate(review.createdAt)}</span>
          <form onSubmit={handleSubmit}>
            <textarea name="message" required="required" onChange={handleChange}>
              {review.message}
            </textarea>
            {errors.message && <span>{errors.message}</span>}
            <button type="submit">update</button>
          </form>
        </>
      )}
      no={() => <h1>no access</h1>}
    />
  );
};

export default ReviewPanelEdit;