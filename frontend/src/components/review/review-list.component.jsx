import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";

import ReviewItem from "./review-item.component";

import { GET_PUBLISHED_REVIEWS } from "../../graphql/queries/review.query";

import { ReviewsPaginationContext } from "../../pages/review/review.component";
import Pagination from "rc-pagination";

const ReviewList = () => {
  let history = useHistory();
  const paginationContext = useContext(ReviewsPaginationContext);
  const { currentPage, itemsPerPage } = paginationContext;

  const { data, error, loading } = useQuery(GET_PUBLISHED_REVIEWS, {
    variables: {
      page: currentPage,
      itemsPerPage: itemsPerPage
    },
    fetchPolicy: "network-only"
  });

  const onPaginationPageChange = (page) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", page.toString());

    history.push({
      pathname: url.pathname,
      search: url.search
    });
  };

  if (loading) return <span>loading</span>;
  if (error) return <span>Error</span>;
  if (!data) return <span>Not found.</span>;

  const { collection, paginationInfo } = data.reviews;
  const { totalCount } = paginationInfo;

  if (!collection.length) return <span>No entries.</span>;

  return (
    <>
      {collection.map(({ id, ...props }) => (
        <ReviewItem key={id} id={id} {...props} />
      ))}
      <Pagination
        onChange={onPaginationPageChange}
        current={currentPage}
        pageSize={itemsPerPage}
        total={totalCount}
      />
    </>
  );

};

export default ReviewList;