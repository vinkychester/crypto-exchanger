import styled from "styled-components";

export const StyledClientListWrapper = styled.div`
  padding-top: 50px;
`;

export const StyledClientGrid = styled.div`
  padding-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(359px, 1fr));
  grid-gap: 15px;
`;

export const StyledClientCard = styled.div`
  padding: 15px;
  background-color: #F3F3F3;
  border: 1px solid #E5E5E5;
  border-radius: 10px;
  transition: all .3s ease;
  &:hover {
    box-shadow: 0px 4px 15px 4px rgba(0, 0, 0, 0.1);
  }
`;