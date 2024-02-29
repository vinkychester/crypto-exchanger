import styled from "styled-components";

export const StyledPaymentSettingsWrapper = styled.div`
  padding-top: 50px;
  .pair-unit-item {
    .input-group {
      margin-bottom: 0;
    }
    
    &__head {
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      .pair-unit-item__title {
        font-size: 18px;
        display: inline-grid;
        grid-template-columns: repeat(3, max-content);
        grid-gap: 5px;
        span {
          color: #A7B3C1;
        }
      }
      @media screen and (max-width: 576px) {
        display: inline-flex;
        flex-direction: column;
        .pair-unit-item__title {
          margin-bottom: 15px;
        }
      }
    }
    &__content {
      @media screen and (max-width: 992px) {
        grid-template-columns: repeat(2, 1fr);
      }
      @media screen and (max-width: 576px) {
        grid-gap: 15px;
      }
    }
    &__tabs {
      max-width: 155px;
      @media screen and (max-width: 992px) {
        max-width: 100%;
      }
    }    
  }
`;

export const StyledPairWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  grid-gap: 30px;
  @media screen and (max-width: 576px) {
    grid-template-columns: 100%;
  }
  
  
  .pair-item {
    margin-bottom: 0;
  }
  
  .pair-part {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    &__icon {
      margin-right: 10px;
      color: #A7B3C1;
      font-size: 24px;
    }
    &__description {
      padding-left: 5px;
      color: #A7B3C1;
    }
  }
`;

export const StyledPairPart = styled.div`

`;