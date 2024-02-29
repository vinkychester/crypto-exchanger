import React, { useContext } from "react";
import { useQuery, useApolloClient } from "@apollo/client";
import Pagination from "rc-pagination";

import Can from "../../../components/can/can.component";
import AlertMessage from "../../alert/alert.component";
import CardVerificationItem from "./card-verification-item.component";

import { StyledTableHead } from "../../styles/styled-card";

import { GET_USER_CACHE_DETAILS } from "../../../graphql/queries/user.query";
import { GET_CREDIT_CARDS } from "../../../graphql/queries/credit-card.query";
import { CardVerificationFilterContext } from "../../../pages/card-verification/card-verification.component";
import { cardVerification } from "../../../rbac-consts";

const CardVerificationList = () => {
  let permissions = {};
  const client = useApolloClient();

  const { userId, userRole } = client.readQuery({
    query: GET_USER_CACHE_DETAILS,
  });

  const { filter, handleChangeFilter } = useContext(CardVerificationFilterContext);
  const { itemsPerPage } = filter;

  if ("client" === userRole) permissions = { client_id: userId };

  const { page, date_gte, date_lte, ...props } = filter;
  
  const currentPage = page ? parseInt(page) : 1;

  const { data, loading, error, refetch } = useQuery(GET_CREDIT_CARDS, {
    variables: {
      ...props,
      ...permissions,
      itemsPerPage: itemsPerPage ? parseInt(itemsPerPage) : 50,
      page: currentPage,
    },
    fetchPolicy: "network-only",
  });

  const handlePaginationChange = (page) => {
    // change current page
    handleChangeFilter("page", page);
  };

  if (loading) return "loading";
  if (error) return <AlertMessage type="error" message="Error"/>;
  if (!data) return <AlertMessage type="warning" message="Not found"/>;

  const { collection, paginationInfo } = data.creditCards;

  if (!collection.length) return <AlertMessage type="info" message="Cards for verification is missing"/>;

  const { totalCount } = paginationInfo;

  return (
    <>
      <StyledTableHead className="card-verification-head" col={userRole === "client" ? 3 : 4}>
        <ul className="table-head">
          <li className="table-head__item">
            Date
          </li>
          <Can
            role={userRole}
            perform={cardVerification.CLIENT_DETAILS}
            yes={() => <li className="table-head__item">Client</li>}
          />
          <li className="table-head__item">
            Expire
          </li>
          <li className="table-head__item">
            Status
          </li>
        </ul>
      </StyledTableHead>
      {collection && collection.map(({ id, ...props }) => (
        <CardVerificationItem key={id} id={id} refetch={refetch} {...props} />
      ))}
      <Pagination
        onChange={handlePaginationChange}
        current={currentPage}
        pageSize={10}
        total={totalCount}
      />
    </>
  );
};

export default React.memo(CardVerificationList);
