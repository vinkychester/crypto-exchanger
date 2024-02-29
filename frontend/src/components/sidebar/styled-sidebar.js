import styled from "styled-components";

export const StyledSidebarWrapper = styled.div`
  .sidebar-action-wrapper {
    width: 225px;
    display: flex;
    justify-content: flex-end;
    @media screen and (max-width: 992px) {
      width: auto;
    }
  }
`;

export const StyledAccountLoginWrapper = styled.div`
  max-width: 225px;
  width: 100%;
  display: inline-grid;
  grid-template-columns: repeat(2, max-content);
  justify-content: end;
  grid-gap: 15px;
  .login-link_m {
    font-size: 22px;
    display: none;
    align-items: center;
    cursor: pointer;
    transition: all .3s ease;
    &:hover {
      color: #7482B4;
    }
  }
  @media screen and (max-width: 992px) {
    grid-gap: 0;
    width: auto;
    .login-link_m {
      display: inline-flex;
    }
    .login-link, .register-link {
      display: none;
    }
  }
`;

export const StyledShowSidebar = styled.div`
  font-size: 22px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  transition: all .3s ease;
  &:hover {
    color: #7482B4;
  }
`;

export const StyledSidebar = styled.div`
  height: 100%;
`;

export const StyledAccount = styled.div`
  padding: 25px 15px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(32, 32, 32, .2);
  background-color: #31344a;
  .user {
    width: 100%;
    &__photo {
      width: 40px;
      height: 40px;
      margin: 0 auto;
      overflow: hidden;
      border-radius: 3px;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
      }
    }
    &__name {
      padding: 15px 0 5px;
      color: #fff;
      font-size: 14px;
      font-weight: 700;
      text-align: center;
      text-transform: capitalize;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    } 
    &__email {
      color: #fff;
      font-size: 12px;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      opacity: 0.5;
    }
  }
`;

export const StyledSidebarItem = styled.div`
  cursor: pointer;
  .sidebar-link {
    color: #fff;
    &__icon {
      color: #9DA6B6;
      width: 25px;
      height: 18px;
      font-size: 16px;
      text-align: center;
      opacity: 0.5;
    }
    &__title {
      padding-left: 10px;
    }
    &:hover {
      background-color: #31344a;
      opacity: 1;
    }
    &_current {
      color: #fff;
      background-color: #0a0b21;
      opacity: 1;
    }
  }
`;

export const SidebarLink = styled.div`
  width: 100%;
  padding: 14px 8px;
  display: flex;
  align-items: center;
  border: none;
  outline: none;
`;
