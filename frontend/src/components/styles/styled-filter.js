import styled from "styled-components";

export const StyledFilterWrapper = styled.div`
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: 100%;
`;

export const StyledFilterHead = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 85px) 20%;
  grid-gap: 15px;
`;

export const StyledFilterBody = styled.div`
  ${({hide}) => hide && 'height: 0'};
  ${({hide}) => hide && 'display: none'};
  ${({hide}) => hide === false ? 'animation: loadContent .15s ease' : 'animation: none'};
  margin-top: 20px;
  padding: 15px;
  background-color: #F3F3F3;
  border: 1px solid #E5E5E5;
  box-shadow: 0 4px 15px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  .filter-content {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-gap: 15px;
    @media screen and (max-width: 992px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media screen and (max-width: 576px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media screen and (max-width: 320px) {
      grid-template-columns: 100%;
    }
  }
`;