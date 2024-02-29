import React from "react";
import { useApolloClient } from "@apollo/client";
import { NavLink } from "react-router-dom";
import AlertMessage from "../../../alert/alert.component";

import { StyledButton } from "../../../styles/styled-button";

import { GET_USER_CACHE_DETAILS } from "../../../../graphql/queries/user.query";
import { requisitionStatusConst } from "../../../../utils/consts.util";

const Link = ({ value, requisitionStatus, tag }) => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_CACHE_DETAILS
  });

  if (tag === "CRYPTO") return <></>;

  if (
    "client" !== userRole &&
    (requisitionStatus === requisitionStatusConst.INVOICE ||
      requisitionStatus === requisitionStatusConst.NEW)
  )
    return <AlertMessage type="warning" margin="15px 0 0" message="Payment is expected from the client" />;

  return (
    <div className="requisition-to-pay">
      {"client" === userRole &&
      (requisitionStatus === requisitionStatusConst.INVOICE ? (
        <div className="requisition-to-pay__align">
          <StyledButton
            as="a"
            href={value}
            target="_blank"
            color="success"
            type="button"
            rel="noreferrer"
          >
            Proceed to pay
          </StyledButton>
        </div>
      ) : (
        <AlertMessage
          type="info"
          message={<>
            The exchange rules are 30 minutes after payment of the order. If you have any questions, please contact the
            service managers. You can find managers' contacts in{" "}
            <NavLink to="/contacts" className="default-link">
              the corresponding section of the site
            </NavLink>
            .
          </>}
        />
      ))}
    </div>
  );
};

export default Link;
