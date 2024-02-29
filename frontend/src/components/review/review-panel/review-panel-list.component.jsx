import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";
import queryString from "query-string";
import Pagination from "rc-pagination";

import ReviewPanelItem from "./review-panel-item.component";

import { GET_ALL_REVIEWS_FILTER } from "../../../graphql/queries/review.query";

import { ReviewAdminFilterContext } from "../../../pages/review/review-panel.component";
import { convertDateToTimestampEnd, convertDateToTimestampStart } from "../../../utils/datetime.util";

const ReviewPanelList = () => {
  const history = useHistory();
  const { filter, handleChangeFilter } = useContext(ReviewAdminFilterContext);
  const { itemsPerPage } = filter;
  const object = Object.entries(filter).reduce((a, [k, v]) => (a[k] = v, a), {});
  const { page, date_lte, date_gte } = object;
  const currentPage = page ? parseInt(page) : 1;

  const { data, error, loading } = useQuery(GET_ALL_REVIEWS_FILTER, {
    variables: {
      ...object,
      itemsPerPage: itemsPerPage ? +itemsPerPage : 50,
      page: currentPage,
      date_lte: convertDateToTimestampEnd(date_lte),
      date_gte: convertDateToTimestampStart(date_gte)
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

  if (loading) return <span>loading</span>;
  if (error) return <span>Error</span>;
  if (!data) return <span>Not found.</span>;

  const { collection, paginationInfo } = data.reviews;

  if (!collection.length) return <span>No reviews.</span>;

  const { totalCount } = paginationInfo;

  return (
    <>
      <div>
        <table>
          <thead>
          <th>Publication</th>
          <th>Date</th>
          <th>Client</th>
          <th>Message</th>
          <th></th>
          <th></th>
          </thead>
          <tbody>
          {collection.map(({ id, ...props }) => (
            <ReviewPanelItem key={id} id={id} {...props} />
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

export default ReviewPanelList;