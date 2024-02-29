import styled from "styled-components";

export const StyledRequisitionDetailsWrapper = styled.div`
  padding-top: 50px;
`;


export const StyledRequisitionDetailsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width: 576px) {
    flex-direction: column-reverse;
    align-items: flex-start;
  }
`;

export const StyledRequisitionDetailsTitle = styled.h1`
  font-size: 24px;
  .requisition-title {
    display: inline-grid;
    align-items: center;
    grid-gap: 5px;
    grid-template-columns: repeat(3, max-content);
    &__number {
      text-transform: uppercase;
    }
  }
  .icon-copy {
    padding-bottom: 3px;
    color: #A7B3C1;
    font-size: 16px;
    cursor: pointer;
  }
  @media screen and (max-width: 768px) {
    padding-bottom: 20px;
    font-size: 18px;
    text-align: center;
  }
`;

export const StyledRequisitionDetailsDate = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .requisition-date {
    padding-left: 22px;
    color: #9DA6B6;
    position: relative;
    &:before {
      content: "\\e918";
      color: #19183D;
      font-family: "buycoin-icon",sans-serif;
      position: absolute;
      top: -1px;
      left: 0;
    }
  }
  @media screen and (max-width: 576px) {
    width: 100%;
    align-items: center;
    text-align: center;
  }
`;

export const StyledRequisitionDetailsCommission = styled.div`
  ${({hide}) => hide && 'height: 0'};
  ${({hide}) => hide && 'display: none'};
  ${({hide}) => hide === false ? 'animation: loadContent .15s ease' : 'animation: none'};
  margin-top: 10px;
  padding: 15px;
  background-color: #F3F3F3;
  border: 1px solid #E5E5E5;
  border-radius: 5px;
  .requisition-info {
    margin: 0 20% 15px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 1px dotted #9DA6B6;
    &__name {
      color: #A7B3C1;
    }
    &__value {
      color: #121026;
    }
    &:last-child {
      margin-bottom: 0;
    }
    @media screen and (max-width: 768px) {
      margin: 0 0 15px;
      text-align: center;
      flex-direction: column;
      border: none;
    }
  }
`;

export const StyledRequisitionDetailsShowCommissions = styled.div`
  text-align: center;
  span {
    padding-right: 20px;
    color: #A7B3C1;
    cursor: pointer;
    transition: all .3s ease;
    position: relative;
    &:after {
      content: "\\e935";
      width: 12px;
      height: 12px;
      font-family: "buycoin-icon",sans-serif;
      border: 1px solid #A7B3C1;
      border-radius: 2px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 0;
      right: 0;
      ${({hide}) => !hide && 'transform: rotate(180deg)'};
    }
    &:hover {
      color: #121026;
    }
  }
`;

export const StyledRequisitionDetailsData = styled.div`
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid #E5E5E5;
  position: relative;
  .icon-copy {
    padding-left: 3px;
    color: #A7B3C1;
    cursor: pointer;
  }
  .requisition-data {
    margin-top: 10px;
    &__qrcode {
      margin: 15px auto 0;
      padding: 10px;
      border: 1px solid #E5E5E5;
      background-color: #F3F3F3;
      border-radius: 10px;
      box-shadow: 0 4px 15px 4px rgb(0 0 0 / 10%);
    }
  }
  .requisition-status {
    position: absolute;
    top: 35px;
    right: 0;
  }
  .requisition-action {
    padding-top: 30px;
    display: grid;
    grid-template-columns: repeat(2, max-content);
    grid-gap: 15px;
    justify-content: center;
  }
  .requisition-to-pay {
    padding-top: 30px;
    &__align {
      text-align: center;
    }
  }
  @media screen and (max-width: 576px) {
    .requisition-status {
      text-align: center;
      margin-bottom: 15px;
      position: static;
    }
  }
`;

export const StyledRequisitionDetailsExchangeWrapper = styled.div`
  padding: 30px 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 30px;
  position: relative;
  &:before {
    content: "\\e938";
    width: 30px;
    height: 30px;
    color: #A7B3C1;
    font-family: "buycoin-icon", sans-serif;
    font-size: 30px;
    position: absolute;
    bottom: 0;
    left: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transform: translate(-50%, -30px);
  }
  @media screen and (max-width: 768px) {
    grid-template-columns: 100%;
    grid-gap: 0;
    row-gap: 25px;
    &:before {
      display: none;
    }
  }
`;

export const StyledRequisitionDetailsAmount = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  .requisition-amount__label {
    color: #A7B3C1;
    font-size: 11px;
    text-align: center;
    letter-spacing: 0.4px;
  }
  .requisition-amount__value {
    display: flex;
    align-items: center;
    span {
      margin-right: 10px;
      color: #A7B3C1;
      font-size: 30px;
    }
  }
`