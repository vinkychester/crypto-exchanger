import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";
import Pagination from "rc-pagination";

import ClientsItem from "./clients-item.component";
import AlertMessage from "../../alert/alert.component";

import { StyledClientGrid } from "./styled-client-list";

import { GET_USER_LIST_BY_ROLE } from "../../../graphql/queries/user.query";
import { ClientsFilterContext } from "./clients-list.container";

const ClientsList = () => {
  const history = useHistory();
  const { filter, sign, handleChangeFilter, setTotalCount } = useContext(ClientsFilterContext);

  const object = Object.entries(filter).reduce((a, [k, v]) => (a[k.slice(1)] = v, a), {});
  const { page } = object;

  const currentPage = page ? parseInt(page) : 1;

  const { data, loading, error } = useQuery(GET_USER_LIST_BY_ROLE, {
    variables: {
      ...object,
      roles: "ROLE_CLIENT",
      page: currentPage,
      itemsPerPage: 10
    },
    fetchPolicy: "network-only"
  });

  const handlePaginationChange = (page) => {
    // change current page
    handleChangeFilter(`${sign}page`, page);
  };

  if (loading) return "loading";
  if (error) return <AlertMessage type="error" message="Error"/>;
  if (!data) return <AlertMessage type="warning" message="Not found"/>;

  const { collection, paginationInfo } = data.users;

  if (!collection.length) return <AlertMessage type="info" message="Client is missing"/>;

  const { totalCount } = paginationInfo;

  return (
    <>
      <StyledClientGrid>
        {collection && collection.map(({ id, ...props }) => (
          <ClientsItem key={id} id={id} {...props} />
        ))}
      </StyledClientGrid>
      <Pagination
        onChange={handlePaginationChange}
        current={currentPage}
        pageSize={10}
        total={totalCount}
      />
    </>
  );
};

export default ClientsList;