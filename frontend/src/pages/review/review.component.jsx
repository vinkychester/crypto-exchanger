import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import ReviewList from "../../components/review/review-list.component";
import ReviewCreate from "../../components/review/review-create.component";

export const ReviewsPaginationContext = React.createContext({
  currentPage: 1,
  itemsPerPage: 10
});

const ReviewPage = () => {
  let history = useHistory();
  let searchParams = new URLSearchParams(history.location.search);
  let currentPage = parseInt(searchParams.get("page") ?? 1);

  const paginationContext = useContext(ReviewsPaginationContext);

  const [paginationInfo, setPaginationInfo] = useState({
    ...paginationContext,
    currentPage
  });

  useEffect(() => {
    setPaginationInfo({ ...paginationContext, currentPage });
  }, [currentPage]);

  return (
    <>
      <h1>Reviews</h1>
      <ReviewsPaginationContext.Provider value={paginationInfo}>
        {/*<Can*/}
        {/*  role={userRole}*/}
        {/*  perform={reviews.CREATE}*/}
        {/*  yes={() => <ReviewCreate />}*/}
        {/*/>*/}
        <ReviewCreate />
        <ReviewList />
      </ReviewsPaginationContext.Provider>
    </>
  );
};

export default ReviewPage;