import styled from "styled-components";

export const StyledMainTitle = styled.h1`
  ${({mt}) => mt && `margin-top: ${mt}px`};
  ${({mb}) => mb && `margin-bottom: ${mb}px`};
  color: ${({color}) => color === "white" ? '#fff' : '#121026'};
  ${({size}) => size && `font-size: ${size}px`};
  text-align: ${({position}) => position === "center" ? 'center' : 'left'};
  line-height: 26px;
`;

export const StyledMainDescription = styled.div`
  ${({mt}) => mt && `margin-top: ${mt}px`};
  ${({mb}) => mb && `margin-bottom: ${mb}px`};
  color: #9DA6B6;
  ${({size}) => size && `font-size: ${size}px`};
  text-align: ${({position}) => position === "center" ? 'center' : 'left'};
`;