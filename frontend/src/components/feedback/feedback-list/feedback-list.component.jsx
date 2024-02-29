import React, { useContext, useEffect, useState } from "react";
import Pagination from "rc-pagination";
import { useHistory } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import queryString from "query-string";

import FeedbackItem from "./feedback-item.component";

import { FeedbackFilterContext } from "../../../pages/feedback/feedback.component";

import { GET_ALL_FEEDBACK_MESSAGE } from "../../../graphql/queries/feedback.query";
import {
  DELETE_FEEDBACK_MESSAGE_BY_ID,
  UPDATE_FEEDBACK_MESSAGE_DETAILS
} from "../../../graphql/mutations/feedback.mutation";

import { getPageOnRemove } from "../../../utils/response.util";

const FeedbackList = () => {
  const history = useHistory();

  const [allowedVariables, setAllowedVariables] = useState({
    orderDate: "ASC",
    orderStatus: "ASC",
    deleted: false
  });

  const { filter, handleChangeFilter } = useContext(FeedbackFilterContext);
  const { itemsPerPage, page, ...props } = filter;
  const currentPage = page ? parseInt(page) : 1;

  useEffect(() => {
    switch (props.status) {
      case "deleted":
        setAllowedVariables((prevState) => ({
          ...prevState,
          deleted: true
        }));
        break;
      default:
        setAllowedVariables((prevState) => ({
          ...prevState,
          deleted: false
        }));
        break;
    }
  }, [props.status]);

  const { data, loading, error, refetch } = useQuery(GET_ALL_FEEDBACK_MESSAGE,
    {
      variables: {
        ...props,
        ...allowedVariables,
        itemsPerPage: itemsPerPage ? parseInt(itemsPerPage) : 50,
        page: currentPage,
      },
      fetchPolicy: "network-only"
    });

  const handlePaginationChange = (page) => {
    // change current page
    handleChangeFilter("page", page);
    history.replace({
      search: queryString.stringify({ page: page, ...filter })
    });
  };

  const [deleteFeedbackMessageEnd] = useMutation(DELETE_FEEDBACK_MESSAGE_BY_ID, {
    onCompleted: () => refetch({
      ...props,
      ...allowedVariables,
      itemsPerPage: itemsPerPage ? parseInt(itemsPerPage) : 50,
      page: getPageOnRemove(currentPage,itemsPerPage, lastPage, totalCount, handleChangeFilter),
    })
  });

  const [deleteFeedbackMessage] = useMutation(UPDATE_FEEDBACK_MESSAGE_DETAILS, {
    onCompleted: () => refetch({
      ...props,
      ...allowedVariables,
      itemsPerPage: itemsPerPage ? parseInt(itemsPerPage) : 50,
      page: getPageOnRemove(currentPage,itemsPerPage, lastPage, totalCount, handleChangeFilter),
    })
  });

  if (loading) return <span>loading</span>;
  if (error) return <span>Error</span>;
  if (!data) return <span>Not found.</span>;

  const { collection, paginationInfo } = data.feedbackMessages;

  if (!collection.length) return <span>No messages.</span>;

  const { totalCount, lastPage } = paginationInfo;

  return (
    <>
      <div>
        <table>
          <thead>
          <th>Client</th>
          <th>Date</th>
          <th></th>
          </thead>
          <tbody>
          {collection.map(({ id, ...props }) => (
            <FeedbackItem
              key={id}
              id={id} {...props}
              deleteFeedbackMessageEnd={deleteFeedbackMessageEnd}
              deleteFeedbackMessage={deleteFeedbackMessage}
            />
          ))}
          </tbody>
        </table>
        <Pagination
          onChange={handlePaginationChange}
          current={currentPage}
          pageSize={itemsPerPage ? itemsPerPage : 50}
          total={totalCount}
        />
      </div>
    </>
  );
};

export default React.memo(FeedbackList);