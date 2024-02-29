import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { useApolloClient, useQuery } from "@apollo/client";
import queryString from "query-string";
import Pagination from "rc-pagination";

import BankDetailsItem from "./bank-details-item.component";

import { GET_USER_CACHE_DETAILS } from "../../graphql/queries/user.query";
import { GET_CLIENT_BANK_DETAILS } from "../../graphql/queries/bank-detail.query";

import { BankDetailsFilterContext } from "./bank-details.container";

const BankDetailsList = () => {
  let history = useHistory();

  const client = useApolloClient();
  const { userId } = client.readQuery({ query: GET_USER_CACHE_DETAILS });

  const { filter, handleChangeFilter } = useContext(BankDetailsFilterContext);
  const { page, itemsPerPage, ...props } = filter;

  const currentPage = page ? parseInt(page) : 1;

  const { data, loading, error } = useQuery(GET_CLIENT_BANK_DETAILS, {
    variables: {
      itemsPerPage: itemsPerPage ? parseInt(itemsPerPage) : 50,
      page: currentPage,
      client_id: userId,
      ...props
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

  const { collection, paginationInfo } = data.bankDetails;

  if (!collection.length) return <span>Payment systems are absent</span>;

  const { totalCount } = paginationInfo;

  return (
    <>
      <div>
        <table>
          <thead>
          <th>Payment system</th>
          <th>Name</th>
          <th>Props</th>
          <th></th>
          </thead>
          <tbody>
          {collection.map(({ id, ...props }) => (
            <BankDetailsItem
              key={id}
              id={id}
              {...props}
            />
          ))}
          </tbody>
        </table>
      </div>
      <Pagination
        onChange={handlePaginationChange}
        current={currentPage}
        pageSize={itemsPerPage ? parseInt(itemsPerPage) : 50}
        total={totalCount}
      />
    </>
  );
};

export default BankDetailsList;