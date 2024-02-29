import React from "react";
import styled from 'styled-components'

const status = {
  status: String
}

const changeStatus = (color) => {
  switch (color) {
    case 'ERROR' :
    case 'DISABLED' :
    case 'CANCELED':
    case 'PAST_DUE_DATE':
      return `
        color: #FE6A74;
        background: #FFECEE;
      `;
    case 'CARD_VERIFICATION':
    case 'INVOICE':
    case 'PENDING':
    case 'PROCESSED':
    case 'WARNING':
    case 'NOT_VERIFIED':
      return `
        color: #FF6939;
        background: #FFF2EE;
      `;
    case 'FINISHED':
    case 'ENABLED':
    case 'VERIFIED':
      return `
        color: #4FBAA8;
        background: #E8F7F5;
      `;
    default:
      return `
        color: #7482B4;
        background: #E0E8F4;
      `;
  }
}

export const StyledStatusWrapper = styled.div`
  
`;

export const StyledStatus = styled('div', status)`
  min-width: 70px;
  padding: 6px 10px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  border-radius: 30px;
  display: inline-grid;
  ${({color}) => changeStatus(color)};
`;

const RenderStatus = ({color, status, className}) => {
  return (
    <StyledStatusWrapper className={className}>
      <StyledStatus color={color}>
        {status}
      </StyledStatus>
    </StyledStatusWrapper>
  )
}

export default RenderStatus;