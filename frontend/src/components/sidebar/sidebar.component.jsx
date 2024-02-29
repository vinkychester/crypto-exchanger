import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useApolloClient, useQuery } from "@apollo/client";

import Drawer from "rc-drawer";
import SidebarLinks from "./sidebar-links.component";
import SidebarItem from "./sidebar-itemet.component";

import DefaultImg from "../../assets/images/default-img.svg"
import { StyledButton } from "../styles/styled-button";
import {
  StyledAccount,
  StyledAccountLoginWrapper,
  StyledShowSidebar,
  StyledSidebar,
  StyledSidebarWrapper
} from "./styled-sidebar";

import { GET_USER_CACHE_DETAILS, GET_USER_DETAILS } from "../../graphql/queries/user.query";

const Sidebar = () => {
  const history = useHistory();
  const client = useApolloClient();
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState("");

  const { userId, userRole, isLoggedIn } = client.readQuery({
    query: GET_USER_CACHE_DETAILS
  });

  const { data } = useQuery(GET_USER_DETAILS, {
    variables: { id: `/api/users/${userId}` },
    fetchPolicy: "network-only",
    onCompleted: ({ user }) => {
      const { firstname, lastname, email } = user;
      setUser(prevState => ({
        ...prevState,
        firstname, lastname, email
      }));
    }
  });

  const showSidebar = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const logOut = () => {
    client.writeQuery({
      query: GET_USER_CACHE_DETAILS,
      data: { userId: "", userRole: "", isLoggedIn: false, username: "" }
    });
    localStorage.removeItem("token");
    history.push("/");
  };

  if (!isLoggedIn) {
    return (
      <StyledAccountLoginWrapper>
        <NavLink to="/login" className="login-link_m">
          <span className="icon-start" />
        </NavLink>
        <NavLink to="/login" className="login-link">
          <StyledButton as="span" className="login-link">Login</StyledButton> {" "}
        </NavLink>
        <NavLink to="/registration" className="register-link">
          <StyledButton as="span" color="main" className="register-link">Registration</StyledButton>
        </NavLink>
      </StyledAccountLoginWrapper>
    );
  }

  return (
    <StyledSidebarWrapper>
      <div className="sidebar-action-wrapper">
        <StyledShowSidebar onClick={showSidebar}>
          <span className="icon-account" />
        </StyledShowSidebar>
      </div>
      <Drawer
        width="275"
        placement="right"
        handler={false}
        open={visible}
        onClose={onClose}
      >
        <StyledSidebar>
          <StyledAccount className="sidebar-account">
            <div className="sidebar-account__info user">
              <div className="user__photo">
                <img src={DefaultImg} alt="user-photo" width="40" height="40"/>
              </div>
              <div className="user__name">
                {user.firstname} {user.lastname}
              </div>
              <div className="user__email">{user.email}</div>
            </div>
          </StyledAccount>
          <SidebarLinks handleChange={onClose}  role={userRole}/>
          <SidebarItem
            as="span"
            to="/panel/payment-settings"
            icon="back"
            linkTitle="Sign Out"
            handleChange={() => {
              onClose();
              logOut();
            }}
          />
        </StyledSidebar>
      </Drawer>
    </StyledSidebarWrapper>
  );
};

export default React.memo(Sidebar);