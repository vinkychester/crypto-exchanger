import React, { useState } from "react";

import Logo from "../logo/logo.component";
import Nav from "../navigations/nav.component";
import Sidebar from "../sidebar/sidebar.component";

import { StyledHeader, StyledHeaderContent, StyledHeaderWrapper } from "./styled-header";

const Header = () => {
  const [fixed, setFixed] = useState(false);

  let height = 50;
  let scrolled = 0;
  let ticking = false;

  const fixedHeader = (scrolled) => {
    if (scrolled > height) {
      setFixed(true);
    } else {
      setFixed(false);
    }
  };

  window.addEventListener("scroll", function () {
    scrolled = window.pageYOffset;

    if (!ticking) {
      window.requestAnimationFrame(function () {
        fixedHeader(scrolled);
        ticking = false;
      });
      ticking = true;
    }
  });

  return (
    <StyledHeader id="header" fixed={fixed}>
      <StyledHeaderWrapper className="header__wrapper">
        <StyledHeaderContent className="header__content">
          <Logo fixed={fixed} />
          <Nav />
          <Sidebar fixed={fixed} />
        </StyledHeaderContent>
      </StyledHeaderWrapper>
    </StyledHeader>
  );
};

export default Header;
