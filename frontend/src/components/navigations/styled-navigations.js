import styled from "styled-components";
import chevronDown from "../../assets/images/icons/chevron-down.svg"

export const StyledNavigations = styled.nav``;

export const StyledMenuList = styled.ul`
  display: flex;
  li {
    padding: 0 12px;
    color: #9DA6B6;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    transition: all .3s ease;
    cursor: pointer;
    &:hover {
      color: #19183D;
    }
  }
  li.dropdown-item {
    .custom-button-down {
      width: 14px;
      height: 14px;
      margin-left: 5px;
      display: inline-flex;
      background-image: url(${chevronDown});
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
      border: 1px solid rgba(25, 24, 61, 0.75);
      border-radius: 3px;
    }
  }
  /*.menu-link_current {
    color: #19183D;
  }*/
`;

export const StyledNavbarWrapper = styled.div`
  order: -1;
`;

export const StyledShowNavbar = styled.div`
  font-size: 22px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  transition: all .3s ease;
  &:hover {
    color: #7482B4;
  }
`;

export const StyledNavbar = styled.nav`
  display: grid;
`;

export const StyledDropdownItem = styled.div`
  display: ${({visible}) => visible ? "block" : "none"};
`;
