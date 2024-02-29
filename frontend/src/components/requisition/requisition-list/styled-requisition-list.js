import styled from "styled-components";

export const StyledRequisitionListWrapper = styled.div`
  padding-top: 50px;
  
  ${({role}) => role === 'client' && `
    .requisition-filter {
      &__head {
        grid-template-columns: repeat(2, max-content) 85px;
      }
    }
  `};
  
  .requisition-head {
    padding-right: 66px;
    @media screen and (max-width: 992px) {
      padding-right: 51px;
    }
  }
  
  .requisition-item {
    cursor: pointer;
    position: relative;
    &__head {
      padding-bottom: 10px;
      display: flex;
      justify-content: space-between;
      @media screen and (max-width: 576px) {
        flex-direction: column;
      }
    }
    &__body {
      display: grid;
      grid-template-columns: 1fr max-content;
      align-items: center;
    }
    &__row {
      margin-bottom: 0 !important;
      @media screen and (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 0;
      }
      @media screen and (max-width: 576px) {
        grid-template-columns: 100%;
      }
    }
    &__number {
      font-size: 18px;
      font-weight:  700;
      span {
        padding-left: 3px;
        color: #A7B3C1;
        font-size: 16px;
      }
      @media screen and (max-width: 576px) {
        margin-bottom: 10px;
      }
    }
    &__action {
      @media screen and (max-width: 576px) {
        position: absolute;
        top: 15px;
        right: 5px;
      }
    }
    .user {
      overflow-wrap: break-word;
      &__name {
        font-weight: 700;
      }
      &__name, &__email {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .icon-copy {
        padding-left: 3px;
        color: #A7B3C1;
      }
    }
  }
`;

export const StyledExchangeItem = styled.div`
  display: inline-flex;
  align-items: center;
  .exchange-icon {
    margin-right: 5px;
    color: #A7B3C1;
    font-size: 18px;
  }
`;