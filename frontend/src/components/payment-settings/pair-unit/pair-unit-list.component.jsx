import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";
import Pagination from "rc-pagination";
import queryString from "query-string";

import PairUnitItem from "./pair-unit-item.component";
import AlertMessage from "../../alert/alert.component";

import { GET_PAIR_UNITS_LIST } from "../../../graphql/queries/pair-unit.query";

import { PairUnitFilterContext } from "./pair-unit.container";

const PairUnitList = () => {
  const history = useHistory();
  const { filter, handleChangeFilter } = useContext(PairUnitFilterContext);
  const { uitemsPerPage } = filter;
  const object = Object.entries(filter).reduce((a, [k, v]) => (a[k.slice(1)] = v, a), {});
  const { page } = object;
  const currentPage = page ? parseInt(page) : 1;
  const { data, loading, error } = useQuery(GET_PAIR_UNITS_LIST, {
    variables: {
      ...object,
      itemsPerPage: uitemsPerPage ? +uitemsPerPage : 50,
      page: currentPage
    },
    fetchPolicy: "network-only"
  });
  const handlePaginationChange = (page) => {
    // change current page
    handleChangeFilter("upage", page);
    history.replace({
      search: queryString.stringify({ upage: page, ...filter })
    });
  };

  if (loading) return "loading";
  if (error) return <AlertMessage type="error" message="Error"/>;
  if (!data) return <AlertMessage type="warning" message="Not found"/>;

  const { collection, paginationInfo } = data.pairUnits;

  if (!collection.length) return <span>Payment systems are absent</span>;

  const { totalCount } = paginationInfo;

  return (
    <>
      {collection.map(({ id, ...props }) => (
        <PairUnitItem key={id} id={id} {...props} />
      ))}
      <Pagination
        onChange={handlePaginationChange}
        current={currentPage}
        pageSize={uitemsPerPage ? uitemsPerPage : 50}
        total={totalCount}
      />
    </>
  );

};

export default PairUnitList;