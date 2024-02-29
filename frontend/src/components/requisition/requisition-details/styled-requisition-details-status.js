import styled from 'styled-components';

const typeStep = {
  type: String,
}

const typeColor = (type) => {
  switch (type) {
    case 'done' :
      return `
        &:before, &:after{
          background: #E8F7F5;
        }
        .step__icon:before {
          content: '\\e91f';
          color: #4FBAA8;
          animation: none;
          background: #E8F7F5;
        }
        &:last-child {
          .step__icon:before {
            content: '\\e93d';   
          }
        }
      `;
    case 'inProgress' :
      return `
        &:before, &:after {
          z-index: 2;
        }
        &:before {
          background: linear-gradient(90deg, rgba(232,247,245,1) 0%, rgba(255,242,238,1) 40%);
        }
        &:after {
          background: linear-gradient(90deg, rgba(255,242,238,1) 60%, rgba(224,232,244,1) 100%);
        }
        .step__title {
          display: block;
          @media screen and (max-width: 375px) {
            display: none;
          }
        }
        .step__icon:before {
          content: '\\e91b';
          color: #FF6939;
          background: #FFF2EE;
          animation: none;
        }
        &:nth-child(3) {
          .step__icon:before {
            content: '\\e958';
          }
        }
      `;
    case 'canceled' :
      return `
        &:before, &:after{
          background: #FFECEE;
        }
        .step__icon:before {
          content: '\\e91a';
          color: #FE6A74;
          background: #FFECEE;
          animation: none;
        }
      `;
    case 'disabled' :
      return `
        &:before, &:after{
          background: #FFECEE;
        }
        .step__icon:before {
          content: '\\e962';
          color: #FE6A74;
          background: #FFECEE;
          animation: none;
        }
      `;
    case 'error' :
      return `
        &:before, &:after {
          z-index: 2;
        }
        &:before {
          background: linear-gradient(90deg, rgba(232,247,245,1) 0%, rgba(255,236,238,1) 40%);
        }
        &:after {
          background: linear-gradient(90deg, rgba(255,236,238,1) 60%, rgba(224,232,244,1) 100%);
        }
        .step__icon:before {
          content: '\\e91a';
          color: #FE6A74;
          background: #FFECEE;
          animation: none;
        }
      `;
    default :
      return ``;
  }
}

export const StyledRequisitionDetailsStatus = styled.div`
  padding-bottom: 30px;
  display: grid;
  grid-template-columns: repeat(4, minmax(100px, 220px));
  justify-content: center;
  grid-template-rows: 1fr;
  overflow: hidden;
  border-bottom: 1px solid #E5E5E5;
  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;
export const StyledStatusItem = styled('div', typeStep)`
  position: relative;
  &:before, &:after {
    content: '';
    height: 4px;
    width: 75px;
    background: #E0E8F4;
    position: absolute;
    top: 35px;
    @media screen and (max-width: 576px) {
      top: 20px;
      height: 2px;
    }
  }
  &:before {
    left: 0;
  }
  &:after {
    right: 0;
  }
  &:first-child {
    &:before {
      display: none;
    }
  }
  &:last-child {
    &:after {
      display: none;
    }
  }
  ${({type}) => typeColor(type)};
`;

export const StyledStatusIcon = styled.div`
  width: 100%;
  height: 70px;
  position: relative;
  z-index: 5;
  &:before {
    content: '\\e962';
    width: 70px;
    height: 70px;
    margin: 0 0 0 -35px;
    color: #7482B4;
    font-size: 24px;
    font-family: 'buycoin-icon', serif;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #E0E8F4;
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 50%;
    animation: waiting 10s ease-in infinite 3s;
    @media screen and (max-width: 576px) {
      width: 40px;
      height: 40px;
      margin: 0 0 0 -20px;
      font-size: 16px;
    }
    @keyframes waiting {
      0% {
        transform: rotate(-180deg);
      }
      5% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(0deg);
      }
    }
  }
  @media screen and (max-width: 576px) {
    height: 40px;
  }
`;

export const StyledStatusTitle = styled.div`
  padding-top: 10px;
  color: #121026;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  @media screen and (max-width: 576px) {
    display: none;
    font-size: 14px;
  }
`;