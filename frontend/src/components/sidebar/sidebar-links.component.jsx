import React from "react";
import { NavLink } from "react-router-dom";

import Can from "../can/can.component";
import SidebarItem from "./sidebar-itemet.component";

import { sidebar } from "../../rbac-consts";

const SidebarLinks = ({role, handleChange}) => {
  return (
    <React.Fragment>
      <Can
        role={role}
        perform={sidebar.REQUISITIONS}
        yes={() => (
          <SidebarItem
            as={NavLink}
            to="/panel/requisitions"
            icon="exchange"
            linkTitle="Requisitions"
            handleChange={handleChange}
          />
        )}
      />
      <Can
        role={role}
        perform={sidebar.PAYMENT_SETTINGS}
        yes={() => (
          <SidebarItem
            as={NavLink}
            to="/panel/payment-settings"
            icon="currenci-options"
            linkTitle="Payment settings"
            handleChange={handleChange}
          />
        )}
      />
      <Can
        role={role}
        perform={sidebar.CLIENTS}
        yes={() => (
          <SidebarItem
            as={NavLink}
            to="/panel/clients"
            icon="users"
            linkTitle="Clients"
            handleChange={handleChange}
          />
        )}
      />
      <Can
        role={role}
        perform={sidebar.ACCOUNT}
        yes={() => (
          <SidebarItem
            as={NavLink}
            to="/panel/account"
            icon="user"
            linkTitle="Account"
            handleChange={handleChange}
          />
        )}
      />
      <Can
        role={role}
        perform={sidebar.BANK_DETAILS}
        yes={() => (
          <SidebarItem
            as={NavLink}
            to="/panel/bank-details"
            icon="bank"
            linkTitle="Bank details"
            handleChange={handleChange}
          />
        )}
      />
      <Can
        role={role}
        perform={sidebar.CARD_VERIFICATION}
        yes={() => (
          <SidebarItem
            as={NavLink}
            to="/panel/card-verification"
            icon="card"
            linkTitle="Card verification"
            handleChange={handleChange}
          />
        )}
      />
      <Can
        role={role}
        perform={sidebar.REVIEWS}
        yes={() => (
          <SidebarItem
            as={NavLink}
            to="/panel/reviews"
            icon="chat"
            linkTitle="Reviews"
            handleChange={handleChange}
          />
        )}
      />
      <Can
        role={role}
        perform={sidebar.FEEDBACKS}
        yes={() => (
          <SidebarItem
            as={NavLink}
            to="/panel/feedbacks"
            icon="mail"
            linkTitle="Feedbacks"
            handleChange={handleChange}
          />
        )}
      />
    </React.Fragment>
  )
}

export default React.memo(SidebarLinks);