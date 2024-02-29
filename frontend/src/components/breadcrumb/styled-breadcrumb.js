import styled from 'styled-components';

export const StyledBreadcrumb = styled.ul`
  padding: 20px 0;
  display: flex;
  span {
    color: #121026;
  }
`;
export const StyledBreadcrumbItem = styled.li`
  padding-right: 25px;
  white-space: nowrap;
  position: relative;
  &:after {
    content: "";
    width: 4px;
    height: 4px;
    background-color: #121026;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
  }
  &:last-child {
    max-width: 120px;
    width: 100%;
    padding-right: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:after {
      display: none;
    }
  }
  @media screen and (max-width: 320px) {
    &:last-child {
      max-width: 80px;
    }
  }
`;
export const StyledBreadcrumbLink = styled.a`
  color: #9DA6B6;
  transition: all .1s ease;
  &:hover {
    color: #121026;
  }
`;