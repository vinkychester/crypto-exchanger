import styled from "styled-components";

const colorButton = {
  color: String
};

const styleButton = (color, border) => {
  switch (color) {
    case "main":
      return `
        color: ${border ? '#19183D': '#fff'};
        background-color: ${border ? 'transparent': '#19183D'};
        border: 3px solid #19183D;
        &:hover {
          background-color: ${border ? 'rgba(83, 80, 181, 0.1);': '#222155'};
          border: 3px solid #222155;
        }
     `;
    case "success":
      return `
        color: ${border ? '#44b588': '#fff'};
        background-color: ${border ? 'transparent': '#44b588'};
        border: 3px solid #44b588;
        &:hover {
          background-color: ${border ? 'rgba(68, 181, 181, 0.1);': '#36a579'};
          border: 3px solid #36a579;
        }
     `;
    case "danger":
      return `
        color: ${border ? '#ff4d59': '#fff'};
        background-color: ${border ? 'transparent': '#ff4d59'};
        border: 3px solid #ff4d59;
        &:hover {
          background-color: ${border ? 'rgba(255, 77, 89, 0.1);': '#ed3f4a'};
          border: 3px solid #ed3f4a;
        }
      `;
    case "warning":
      return `
        color: #202020;
        background-color: ${border ? 'transparent': '#ffd97e'};
        border: 3px solid #ffd97e;
        &:hover {
          background-color: ${border ? 'rgba(254, 217, 126, 0.2);': '#f9cd63'};
          border: 3px solid #f9cd63;
        }
     `;
    case "info":
      return `
        color: ${border ? '#7482B4': '#fff'};
        background-color: ${border ? 'transparent': '#7482B4'};
        border: 3px solid #7482B4;
        &:hover {
          background-color: ${border ? 'rgba(116, 130, 180, 0.15);': '#5d6da5'};
          border: 3px solid #5d6da5;
        }
      `;
    default:
      return `
        color: #19183D;
        background: transparent;
        border: 3px solid #19183D;
        &:hover {
          background-color: rgba(83, 80, 181, 0.1);
          border: 3px solid #222155;
        }
      `;
  }
};

export const StyledButton = styled("button", colorButton)`
  ${({ mt }) => mt && `margin-top: ${mt}px`};
  ${({ mb }) => mb && `margin-bottom: ${mb}px`};
  ${({ size }) => size && `font-size: ${size}px`};
  padding: 10px 14px;
  font-weight: ${({ weight }) => weight === "normal" ? "400" : "700"};
  text-align: center;
  vertical-align: middle;
  letter-spacing: 0.5px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: ${({ figure }) => figure === "circle" ? "50%" : "5px"};
  outline: none;
  cursor: pointer;
  transition: all .3s ease;
  ${({ disabled }) => disabled && `
    cursor: not-allowed;
    pointer-events: none;
    opacity: 0.5;
    transform: scale(1) !important;
  `};
  ${({ color, border }) => styleButton(color, border)}
`;


export const StyledCircleButton = styled.button`
  width: 50px;
  height: 50px;
  padding: 0;
  margin: 0;
  color: #7482B4;
  font-size: 24px;
  background-color: #E0E8F4;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 50%;
  outline: none;
  cursor: pointer;
  transition: all .3s ease;
  &:hover {
    background-color: #d4e2f6;
  }
  &:active {
    transform: scale(0.98);
  }
`;