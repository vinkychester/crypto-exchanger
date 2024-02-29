import styled from "styled-components";

export const StyledCalculatorWrapper = styled.div`
  min-height: 560px;
  padding-bottom: 50px;
  display: grid;
  grid-template-columns: 1fr 120px 1fr;
  grid-gap: 30px;
  grid-template-areas: 'payment calc-swap payout'
                       'calc-footer calc-footer calc-footer';
  .calculator_payment {
    grid-area: payment;
  }
  .calculator_payout {
    grid-area: payout;
  }
  .calculator__swap {
    grid-area: calc-swap;
  }
  .calculator__footer {
    grid-area: calc-footer;
  }
  @media screen and (max-width: 992px) {
    grid-template-columns: 1fr;
    grid-gap: 15px;
    grid-template-areas: 'payment'
                         'calc-swap'
                         'payout'
                         'calc-footer';
  }
`;

export const StyledCalculatorSwap = styled.div`
  max-height: 390px;
  padding-top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 992px) {
    padding: 0;
  }
  
  .calculator-swap__btn {
    height: 50px;
    width: 50px;
    color: #A7B3C1;
    font-size: 50px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    outline: none;
    transition: all 0.3s ease;
    cursor: pointer;
    &:hover {
      transform: rotate(-180deg);
    }

    &:active {
      transform: scale(0.95) rotate(180deg);
    }
  }
`;

export const StyledCalculatorTabWrapper = styled.div``;

export const StyledTabTitle = styled.div`
  margin-bottom: 5px;
  font-size: 18px;
  font-weight: 700;
`;

export const StyledTabNavigation = styled.div`
  padding-bottom: 15px;
  display: flex;
  flex-wrap: wrap;
  .selected {
    color: #fff;
    background-color: #19183D;
    &:hover {
      background-color: #222155;
      border: 3px solid #222155;
    }
  }
`;

export const StyledTabNavItem = styled.span`
  margin: 10px 10px 0 0;
  padding: 10px 14px;
  font-weight: 700;
  font-size: 14px;
  text-transform: capitalize;
  display: inline-flex;
  border-radius: 5px;
  background: transparent;
  border: 3px solid #19183D;
  box-shadow: none;
  cursor: pointer;
  position: relative;
  &:last-child {
    margin-right: 0;
  }
  &:hover {
    background-color: rgba(83,80,181,0.1);
    border: 3px solid #222155;
  }
`;

export const StyledTabContent = styled.div`
  height: 290px;
  margin-bottom: 15px;
  padding: 15px 0;
  border-top: 1px solid #1C1738;
  border-bottom: 1px solid #1C1738;
  .exchange-item_current {
    color: #fff;
    background-color: #1C1738;
  }
  .exchange-item_no-exchange {
    opacity: 0.35;
  }
`;

export const StyledTabWrapper = styled.div`
  height: 100%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 9px;
    background-color: #9DA6B6;
    border-radius: 20px;
  }
  &::-webkit-scrollbar-track{
    background: #9DA6B6;
    border-radius: 20px;
  }
  &::-webkit-scrollbar-thumb {
    width: 15px;
    background-color: #23204E;
    border: 2px solid #9DA6B6;
    border-radius: 12px;
  }
`;

export const StyledTabContentItem = styled.span`
  margin-right: 3px;
  padding: 10px 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 5px;
  [class^="exchange-icon-"], [class*="exchange-icon-"] {
    font-size: 25px;
  }
  .exchange-item-name {
    padding: 0 10px;
    font-weight: 700;
  }
  &:hover {
    color: #fff;
    background-color: #A7B3C1;
  }
`;

export const StyledTabInputWrapper = styled.div`
  .exchange-data__input {
    position: relative;
    .input-group {
      margin-bottom: 5px;
    }
    input {
      font-size: 16px;
    }
    &:after {
      content: attr(data-currency);
      font-size: 16px;
      color: #1C1738;
      position: absolute;
      bottom: 12px;
      right: 12px;
      opacity: 0.5;
    }
  }

  .exchange-data__min-max {
    min-height: 45px;
    color: #8691a5;
    font-size: 12px;
    line-height: 14px;
    span {
      color: #1C1738;
      text-decoration: underline;
      cursor: pointer;
    }
  }
`;

export const StyledCalculatorAlignBtn = styled.div`
  text-align: center;
  .exchange-btn {
    position: relative;
    &__tooltip {
      height: 44px;
      width: 120px;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

export const StyledRequisitesWrapper = styled.div`
  grid-column: span 3;
`;

export const StyledRequisitesField = styled.div`
  .requisite-label {
    color: #1C1738;
    font-size: 16px;
    font-weight: 700;
  }
`;

export const StyledAgreeMessage = styled.div`
  margin: 20px 0 0;
  padding: 30px 15px;
  text-align: center;
  background-color: #F3F3F3;
  border: 1px solid #E5E5E5;
  border-radius: 5px;
  p {
    padding-bottom: 25px;
    color: #8691a5;
    font-size: 12px;
  }
`;