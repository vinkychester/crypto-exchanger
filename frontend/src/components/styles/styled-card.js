import styled from "styled-components";

export const StyledTableHead = styled.div`
  margin-bottom: 30px;
  padding: 15px 35px;
  background-color: #F3F3F3;
  border: 1px solid #E5E5E5;
  border-radius: 5px;
  .table-head {
    display: grid;
    grid-template-columns: repeat( ${({col}) => col}, 1fr);
    grid-gap: 20px;
    &__item {
      color: #9DA6B6;
      font-weight: 700;
    }
  }
  @media screen and (max-width: 992px) {
    padding: 15px;
  }
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const StyledCardWrapper = styled.div`
  margin-bottom: 30px;
  padding: 30px 35px;
  background-color: #fff;
  box-shadow: 0 4px 15px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #E5E5E5;
  border-radius: 5px;
  transition: all .3s ease;
  &:hover {
    box-shadow: 0 4px 15px 4px rgba(120, 141, 172, 0.6);
  }
  @media screen and (max-width: 992px) {
    padding: 20px 15px;
  }
`;

export const StyledCardInfoItem = styled.div`
  ${({ mt }) => mt && `margin-top: ${mt}px`};
  ${({ mb }) => mb && `margin-bottom: ${mb}px`};
  padding-top: 20px;
  display: ${({ inline }) => inline ? "inline-flex" : "grid"};
  align-items: start;
  position: relative;
  word-break: break-word;
  &:before {
    content: attr(data-title)':';
    color: #7b8a9b;
    font-size: 11px;
    letter-spacing: 0.4px;
    position: absolute;
    top: 0;
    left: 0;
    }
  }
  @media screen and (max-width: 992px) {
    margin-bottom: 5px;
    padding-top: 20px;
    align-items: start;
  }
`;

export const StyledCardRow = styled.div`
  display: grid;
  grid-template-columns: repeat( ${({col}) => col}, 1fr);
  grid-gap: 20px;
  &:not(:last-child) {
    margin-bottom: 20px;
  }
`;

export const StyledDropdownMenu = styled.div`
  button {
    padding: 5px 0;
    color: #A7B3C1;
    font-size: 36px;
    background-color: transparent;
    border: none;
    outline: none;
    &:hover {
      color: #1c1b30;
    }
    &:active {
      transform: scale(0.98);
    }
  }
`;

export const StyledMenuLink = styled.button`
  width: 100%;
  padding: 5px 10px;
  color: #9DA6B6;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  background-color: transparent;
  border: none;
  outline: none;
  &:hover {
    color: #fff;
  }
`;