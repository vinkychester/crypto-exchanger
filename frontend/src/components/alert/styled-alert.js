import styled from 'styled-components';

const type = {
  type: ''
}

const changeType = (type) => {
  switch (type) {
    case 'error' :
      return `
        background-color: #FFECEE;
        &:before {
          content: '\\e91a';
          color: #FE6A74;
          font-size: 11px;
          background-color: #fbc8ce;
        }
      `;
    case 'success' :
      return `
        background-color: #E8F7F5;
        &:before {
          content: '\\e91e';
          color: #4FBAA8;
          background-color: #D2EFEB;
        }
      `;
    case 'info' :
      return `
        background-color: #F0F4FD;
        &:before {
          content: '\\e948';
          color: #7482B4;
          background-color: #E0E8F4;
        }
      `;
    default :
      return `
        background-color: #FFF2EE;
        &:before {
          content: '\\e986';
          color: #FF6939;
          background-color: #ffdfd5;
        }
      `;
  }
}

export const StyledAlertWrapper = styled('div', type)`
  ${({center}) => center && 'max-width: 1110px'};
  margin: ${({margin}) => margin};
  padding: 15px 15px 15px 55px;
  color: #36363C;
  border-radius: 30px;
  position: relative;
  &:before {
    width: 25px;
    height: 25px;
    font-size: 14px;
    font-family: 'buycoin-icon', serif;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    position: absolute;
    top: 14px;
    left: 15px;
  }
  ${({type}) => changeType(type)}
`;