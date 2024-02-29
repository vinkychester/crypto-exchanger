import React from "react";

import { StyledDropdownMenu, StyledInfoMenuList } from "./styled-dropdown-nav";

const AboutCryptoMenu = () => {
  return (
    <StyledDropdownMenu>
      <StyledInfoMenuList>
        <li>
          How to buy cryptocurrency
        </li>
        <li>
          Bitcoin rate
        </li>
        <li>
          Bitcoin wallet
        </li>
        <li>
          Cryptocurrency exchanger
        </li>
      </StyledInfoMenuList>
    </StyledDropdownMenu>
  );
};

export default AboutCryptoMenu;