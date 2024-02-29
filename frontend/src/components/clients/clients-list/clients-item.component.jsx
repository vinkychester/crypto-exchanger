import React from "react";
import { NavLink } from "react-router-dom";
import { DateTime } from "luxon";

import { StyledClientCard } from "./styled-client-list";
import { StyledButton } from "../../styles/styled-button";
import { StyledCardInfoItem } from "../../styles/styled-card";

import { parseUuidIRI } from "../../../utils/response.util";
import { convertTimestampToDate } from "../../../utils/datetime.util";

const ClientsItem = ({
  id,
  firstname,
  lastname,
  email,
  status,
  createdAt,
  registrationType
}) => {
  return (
    <StyledClientCard>
      <StyledCardInfoItem data-title="Name">
        {firstname} {lastname}
      </StyledCardInfoItem>
      <StyledCardInfoItem data-title="E-mail">
        {email}
      </StyledCardInfoItem>
      <StyledCardInfoItem data-title="Status">
        {status}
      </StyledCardInfoItem>
      <StyledCardInfoItem data-title="Registration type">
        {registrationType}
      </StyledCardInfoItem>
      <StyledCardInfoItem data-title="Registration date">
        {convertTimestampToDate(createdAt)}
      </StyledCardInfoItem> <br/>
      <StyledButton
        color="main"
        border
        as={NavLink}
        to={`/panel/client-details/${parseUuidIRI(id)}`}
      >
        Details
      </StyledButton>
    </StyledClientCard>
  )
};

export default ClientsItem;