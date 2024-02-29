import React from "react";
import { NavLink } from "react-router-dom";
import { useMutation } from "@apollo/client";
import Checkbox from "rc-checkbox";

import { convertTimestampToDate } from "../../../utils/datetime.util";
import { parseUuidIRI } from "../../../utils/response.util";

import { DELETE_REVIEW_BY_ID, UPDATE_REVIEW_DETAILS } from "../../../graphql/mutations/review.mutation";

const ReviewPanelItem = ({ id, publish, message, createdAt, client }) => {
  const [updateReviewPublish] = useMutation(UPDATE_REVIEW_DETAILS, {
    onCompleted: () => {
      alert("publication was successful");
    }
  });

  const [reviewDelete] = useMutation(DELETE_REVIEW_BY_ID, {
    onCompleted: () => {
      alert("review deleted successfully.");
    }
  });

  const handleReviewDelete = () => {
    reviewDelete({
      variables: { id },
      update (cache) {
        cache.modify({
          fields: {
            reviews (existingReviewRefs, { readField }) {
              return existingReviewRefs.collection.filter(
                reviewRef => id !== readField("id", reviewRef)
              );
            }
          }
        });
      }
    });
  };

  const handleReviewPublish = (event) => {
    updateReviewPublish({
      variables: { id: id, publish: event.target.checked }
    });
  };

  return (
    <>
      <tr>
        <td>
          <Checkbox
            className="default-checkbox"
            defaultChecked={publish}
            onChange={handleReviewPublish}
          />
        </td>
        <td>{convertTimestampToDate(createdAt)}</td>
        <td>{client.firstname} {client.lastname}</td>
        <td>{message}</td>
        <td>
          <NavLink to={`/panel/review/edit/${parseUuidIRI(id)}`}>
            Edit
          </NavLink>
        </td>
        <td>
          <button onClick={handleReviewDelete}>
            delete
          </button>
        </td>
      </tr>
    </>
  );
};

export default ReviewPanelItem;