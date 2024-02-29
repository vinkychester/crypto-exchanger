import React from "react";
import { NavLink } from "react-router-dom";

import BuycoinLogo from "../../assets/images/logo.svg";

import { SiteDescription, SiteName, SiteTitle, StyledLogo, StyledLogoIcon, StyledLogoShadow } from "./styled-logo";

const Logo = ({ fixed }) => {
  return (
    <NavLink to="/" className="logo">
      <StyledLogo fixed={fixed}>
        <StyledLogoIcon className="logo-icon">
          <img alt="coin24-logo" src={BuycoinLogo} width="55" height="50" />
        </StyledLogoIcon>
        <SiteTitle className="site-title">
          <SiteName>
            Buycoin
          </SiteName>
          <SiteDescription>
            Cryptocurrency exchange
          </SiteDescription>
        </SiteTitle>
      </StyledLogo>
    </NavLink>
  );
};

export default Logo;