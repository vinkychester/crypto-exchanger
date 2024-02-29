import React from "react";
import { NavLink } from "react-router-dom";

import { parseUuidIRI } from "../../../utils/response.util";

const RequisitionDetailsUserTab = ({ label, user }) => {
  const { id, firstname, lastname, email } = user;

  return (
    <>
      <p>{label}:</p>
      <NavLink to={`/panel/client-details/${parseUuidIRI(id)}`}>
        {firstname} {lastname}
      </NavLink>
      <p>{email}</p>
    </>
  );
};

export default React.memo(RequisitionDetailsUserTab);
