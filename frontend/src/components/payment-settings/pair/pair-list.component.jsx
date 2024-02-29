import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";
import Pagination from "rc-pagination";
import queryString from "query-string";

import PairItem from "./pair-item.component";

import { PairFilterContext } from "./pair.container";
import { GET_ALL_PAIRS_WITH_IS_REQUISITION } from "../../../graphql/queries/pair.query";
import { StyledPairWrapper } from "../../../pages/payment-settings/styled-payment-settings";

const PairList = () => {
  const history = useHistory();
  const { filter, handleChangeFilter } = useContext(PairFilterContext);
  const { pitemsPerPage } = filter;

  const object = Object.entries(filter).reduce((a, [k, v]) => (a[k.slice(1)] = v, a), {});
  const { page, active } = object;

  const currentPage = page ? parseInt(page) : 1;

  const { data, loading, error } = useQuery(GET_ALL_PAIRS_WITH_IS_REQUISITION, {
    variables: {
      ...object,
      active: active ? active === "true" : null,
      itemsPerPage: pitemsPerPage ? parseInt(pitemsPerPage) : 50,
      page: currentPage
    },
    fetchPolicy: "network-only"
  });

  const handlePaginationChange = (page) => {
    // change current page
    handleChangeFilter("ppage", page);
    history.replace({
      search: queryString.stringify({ ppage: page, ...filter })
    });
  };

  if (loading) return <span>loading</span>;
  if (error) return <span>Error</span>;
  if (!data) return <span>Not found.</span>;

  const { collection, paginationInfo } = data.pairs;

  if (!collection.length) return <span>Payment pair are absent</span>;

  const { totalCount } = paginationInfo;

  return (
    <>
      <StyledPairWrapper>
        {collection.map(({ id, ...props }) => (
          <PairItem key={id} id={id} {...props} />
        ))}
      </StyledPairWrapper>
      <Pagination
        onChange={handlePaginationChange}
        current={currentPage}
        pageSize={pitemsPerPage ? pitemsPerPage : 50}
        total={totalCount}
      />
    </>
  );
};

export default PairList;