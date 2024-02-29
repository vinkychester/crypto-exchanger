import styled from "styled-components";

export const StyledLogo = styled.div`
  display: inline-grid;
  grid-template-columns: max-content 140px;
  grid-gap: 10px;
  @media screen and (max-width: 576px) {
    grid-template-columns: max-content;
    grid-gap: 0;
  }
  &:hover {
    .logo-icon img {
      transform: rotate(180deg);
    }
  }
  ${({fixed}) => fixed && `
    .logo-icon {
      img {
        width: 35px;
        @media screen and (max-width: 992px) {
          width: 100%;
        }
      }
    }
    .site-title {
      visibility: hidden;
      opacity: 0;
      display: none;
    }
  `};
`;

export const StyledLogoIcon = styled.div`
  width: 55px;
  height: 50px;
  z-index: 1;
  img {
    transition: all .3s ease;
  }
`;

export const SiteTitle = styled.div`
  //margin-left: 10px;
  display: flex;
  flex-direction: column;
  text-align: center;
  @media screen and (max-width: 576px) {
    display: none;
  }
`;

export const SiteName = styled.h3`
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.3px;
  line-height: 34px;
  text-transform: uppercase;
`;
export const SiteDescription = styled.p`
  color: #9DA6B6;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.2px;
  line-height: 8px;
  text-transform: uppercase;
`;