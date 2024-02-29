import React from "react";
import { convertTimestampToDate } from "../../utils/datetime.util";

const ReviewItem = ({ message, createdAt, client }) => {

  return (
    <>
      <span>{message}</span><br />
      <span>{client.firstname} </span>
      <span>{convertTimestampToDate(createdAt)}</span>
    </>
  );
};

export default ReviewItem;