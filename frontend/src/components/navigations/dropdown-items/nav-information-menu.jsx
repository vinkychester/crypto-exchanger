import React from "react";
import { NavLink } from "react-router-dom";

import { StyledDropdownMenu, StyledInfoMenuList } from "./styled-dropdown-nav";

const InformationMenu = () => {
  return (
    <StyledDropdownMenu>
      <StyledInfoMenuList>
        <li>
          About us
        </li>
        <li>
          Useful articles
        </li>
        <li>
          <NavLink to="/reviews">
            Reviews
          </NavLink>
        </li>
        <li>
          Exchange directions
        </li>
        <li>
          Loyalty program
        </li>
      </StyledInfoMenuList>
    </StyledDropdownMenu>
  );
};

export default InformationMenu;