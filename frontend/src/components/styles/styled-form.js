import styled from "styled-components";

export const StyledFormWrapper = styled.div`
  ${({width}) => width && `max-width: ${width}px`};
  ${({mt}) => mt && `margin-top: ${mt}px`};
  ${({mb}) => mb && `margin-bottom: ${mb}px`};
  padding: 25px;
  background-color: #fff;
  border: 1px solid #E5E5E5;
  border-radius: 15px;
  box-shadow: 0 4px 15px 4px rgba(120,141,172,0.6);
  @media screen and (max-width: 576px) {
    padding: 30px 15px !important;
  }
`;

export const StyledFormText = styled.div`
  text-align: center;
  p {
    color: #9DA6B6;
  }
  a {
    color: #110F25;
  }
`;