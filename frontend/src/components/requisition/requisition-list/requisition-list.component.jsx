import React, { useContext } from "react";
import { useQuery, useApolloClient } from "@apollo/client";
import Pagination from "rc-pagination";

import Can from "../../can/can.component";
import RequisitionItem from "./requisition-item.component";

import { StyledTableHead } from "../../styles/styled-card";

import { GET_USER_CACHE_DETAILS } from "../../../graphql/queries/user.query";
import { GET_REQUISITION_LIST } from "../../../graphql/queries/requisition.query";
import { RequisitionFilterContext } from "../../../pages/requisition/requisition.component";
import { requisition } from "../../../rbac-consts";
import { convertDateToTimestampStart, convertDateToTimestampEnd } from "../../../utils/datetime.util";
import AlertMessage from "../../alert/alert.component";

const RequisitionList = () => {
  let permissions = {};
  const client = useApolloClient();

  const { userRole, userId } = client.readQuery({
    query: GET_USER_CACHE_DETAILS,
  });

  const { filter, handleChangeFilter } = useContext(RequisitionFilterContext);
  const { itemsPerPage, page, date_gte, date_lte, ...props } = filter;

  const currentPage = page ? parseInt(page) : 1;

  if ("client" === userRole) {
    permissions = { client_id: userId };
  }

  const { data, loading, error } = useQuery(GET_REQUISITION_LIST, {
    variables: {
      ...permissions,
      ...props,
      date_gte: convertDateToTimestampStart(date_gte),
      date_lte: convertDateToTimestampEnd(date_lte),
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

  const { collection, paginationInfo } = data.requisitions;

  if (!collection.length) return "No requisitions";

  const { totalCount } = paginationInfo;

  return (
    <>
      <StyledTableHead className="requisition-head" col={userRole === "client" ? 3 : 4}>
        <ul className="table-head">
          <li className="table-head__item">
            ID and Date
          </li>
          {userRole !== "client" &&
            <li className="table-head__item">
              Client
            </li>}
          <li className="table-head__item">
            Payment system
          </li>
          <li className="table-head__item">
            Amount
          </li>
        </ul>
      </StyledTableHead>
      {collection &&
        collection.map(({ id, ...props }) => (
          <RequisitionItem key={id} id={id} {...props} />
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

export default React.memo(RequisitionList);
