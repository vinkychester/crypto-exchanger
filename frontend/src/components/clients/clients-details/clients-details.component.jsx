import React from "react";

import ClientDelete from "./client-delete.component";
import ClientBan from "./client-ban.component";

import { convertTimestampToDate } from "../../../utils/datetime.util";
import { StyledButton } from "../../styles/styled-button";

const ClientsDetails = ({ user }) => {
  const { id, firstname, lastname, email, createdAt, registrationType, isDeleted, isBanned } = user;
  return (
    <>
      <p>{firstname}</p>
      <p>{lastname}</p>
      <p>{email}</p>
      <p>{convertTimestampToDate(createdAt)}</p>
      <p>{registrationType}</p>
      <StyledButton
        color="info"
        weight="normal"
        type="submit"
      >
        <a href={"/panel/clients"}>Return</a>
      </StyledButton>
      {!isDeleted && <ClientDelete id={id} />}
      {!isBanned && <ClientBan id={id} />}
    </>
  );
};

export default ClientsDetails;

