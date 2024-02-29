import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import Dropdown from "rc-dropdown";
import Drawer from "rc-drawer";
import InformationMenu from "./dropdown-items/nav-information-menu";
import AboutCryptoMenu from "./dropdown-items/nav-about-crypto-menu";
import SidebarItem from "../sidebar/sidebar-itemet.component";

import {
  StyledDropdownItem,
  StyledMenuList,
  StyledNavbar,
  StyledNavbarWrapper,
  StyledNavigations,
  StyledShowNavbar
} from "./styled-navigations";

const Nav = () => {
  const [infoMenu, setInfoMenu] = useState(false);
  const [cryptoMenu, setCryptoMenu] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: null
  });
  const [visible, setVisible] = useState(false);

  const showNavbar = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    if (windowSize.width <= 992) {
      setIsDesktop(false);
    } else {
      setIsDesktop(true);
    }
  }, [windowSize.width]);

  if (!isDesktop) {
    return (
      <StyledNavbarWrapper className="navbar">
        <StyledShowNavbar onClick={showNavbar}>
          <span className="icon-menu-burger" />
        </StyledShowNavbar>
        <Drawer
          width="275"
          placement="left"
          handler={false}
          open={visible}
          onClose={onClose}
        >
          <StyledNavbar>
            <SidebarItem
              exact={true}
              as={NavLink}
              to="/"
              icon="home"
              linkTitle="Home"
              handleChange={onClose}
            />
            <SidebarItem
              as={NavLink}
              to="/rates"
              icon="statistics"
              linkTitle="Courses"
              handleChange={onClose}
            />
            <SidebarItem
              icon="info"
              linkTitle="Informations"
              handleChange={() => {setInfoMenu(!infoMenu);}}
            />
            <StyledDropdownItem visible={infoMenu}>
              <InformationMenu />
            </StyledDropdownItem>
            <SidebarItem
              icon="crypto"
              linkTitle="About Crypto"
              handleChange={() => {setCryptoMenu(!cryptoMenu);}}
            />
            <StyledDropdownItem visible={cryptoMenu}>
              <AboutCryptoMenu />
            </StyledDropdownItem>
            <SidebarItem
              as={NavLink}
              to="/contacts"
              icon="mail"
              linkTitle="Contacts"
              handleChange={onClose}
            />
            <SidebarItem
              as={NavLink}
              to="/login"
              icon="start"
              linkTitle="Sign in"
              handleChange={onClose}
            />
          </StyledNavbar>
        </Drawer>
      </StyledNavbarWrapper>
    );
  }

  return (
    <StyledNavigations id="nav" className="menu">
      <StyledMenuList>
        <li className="menu-item">
          <NavLink to="/rates" activeClassName="menu-link_current">Courses</NavLink>
        </li>
        <Dropdown
          getPopupContainer={() => document.getElementById("nav")}
          overlay={InformationMenu}
          trigger={["click"]}
          placement="bottomCenter"
          animation="slide-up"
        >
          <li
            className="menu-item dropdown-item"
            onClick={(event) => event.preventDefault()}
          >
            Informations <span className="custom-button-down" />
          </li>
        </Dropdown>
        <Dropdown
          getPopupContainer={() => document.getElementById("nav")}
          overlay={AboutCryptoMenu}
          trigger={["click"]}
          placement="bottomCenter"
          animation="slide-up"
        >
          <li
            className="menu-item dropdown-item"
            onClick={(event) => event.preventDefault()}
          >
            About Crypto <span className="custom-button-down" />
          </li>
        </Dropdown>
        <li className="menu-item">
          <NavLink to="/contacts" activeClassName="menu-link_current">Contacts</NavLink>
        </li>
      </StyledMenuList>
    </StyledNavigations>
  );
};

export default Nav;