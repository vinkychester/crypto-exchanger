import styled from 'styled-components'

export const StyledDropdownMenu = styled.div`
  padding: 10px;
  display: grid;
  grid-template-columns: 1fr;
  background-color: #F3F3F3;
  border: 1px solid #E5E5E5;
  border-radius: 5px;
  z-index: 9999999;
  @media screen and (max-width: 992px) {
    border-radius: 0;
    border: none;
    background-color: transparent;
  }
`;

export const StyledInfoMenuList = styled.ul`
  li {
    padding: 5px 0;
    font-family: "Montserrat";
    display: flex;
    @media screen and (max-width: 992px) {
      padding: 14px 8px 14px 34px;
      color: #fff;
      opacity: 0.75;
      transition: all .3s ease;
      &:hover {
        opacity: 1;
      }
    }
  }
`;