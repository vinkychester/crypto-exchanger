import styled from "styled-components";

export const StyledRatesWrapper = styled.div`
  padding-top: 50px;
  .rate-title {
    padding-bottom: 50px;
  }
  .rate-head {
    @media screen and (max-width: 992px) {
      display: none;
    }
  }
  
  .rate-item {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 20px;
    align-items: center;
    &__info {
      padding: 0;
      &:before {
        display: none;
      }
    }
    @media screen and (max-width: 992px) {
      grid-template-columns: repeat(2, 1fr);
      &__info {
        padding-top: 25px;
        &:before {
          display: block;
        }
      }
    }
    @media screen and (max-width: 768px) {
      grid-template-columns: 100%;
    }
  }

  .course-container {
    &__amount {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &__currency {
      text-align: left;
    }
  }
`;

export const StyledChooseWrapper = styled.div`
  padding-top: 27px;
  position: relative;
  .choose-direction {
    max-width: 350px;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  @media screen and (max-width: 768px) {
    padding-top: 0;
    .choose-direction {
      position: static;
      max-width: 100%;
    }
  }
`;

export const StyledRatesName = styled.div`
  display: grid;
  grid-template-columns: 50px max-content;
  grid-gap: 30px;
  align-items: center;
  .rate-item__icon {
    color: #A7B3C1;
    font-size: 50px;
    text-align: center;
  }
  .rate-item__title {
    display: flex;
    flex-direction: column;
    b {
      font-size: 20px;
    }
  }
  @media screen and (max-width: 992px) {
    grid-gap: 15px;
  }
`;

export const StyledDayChange = styled.div`
  span {
    padding: 5px 10px;
    color: ${({color}) => color === "green" ? "#4FBAA8" : color === "red" ? "#FE6A74" : "#7482B4"};
    background-color: ${({color}) => color === "green" ? "#E8F7F5" : color === "red" ? "#FFECEE" : "#E0E8F4"};
    border-radius: 30px;
  }
`;

export const StyledCourseContainer = styled.div`
  display: inline-grid;
  grid-template-columns: minmax(120px, 135px) repeat(2, max-content);
  grid-gap: 5px;
  cursor: pointer;
  @media screen and (max-width: 992px) {
    padding: 12px 14px;
    color: ${({type}) => type === "Sale" ? "#FE6A74" : "#4FBAA8"};
    background-color: ${({type}) => type === "Sale" ? "#FFECEE" : "#E8F7F5"};
    border-radius: 30px;
    grid-template-columns: 1fr repeat(2, max-content);
  }
`;

export const StyledNotAvailable = styled.div`
  color: #A7B3C1;
  cursor: not-allowed;
  position: relative;
`;

export const StyledReserveWrapper = styled.div`
  .reserve-balance {
    display: flex;
    justify-content: flex-end;
    &__bank {
      color: #121026;
      font-weight: 700;
    }
    a {
      color: #7b8a9b;
      font-size: 12px;
      &:hover {
        color: #121026;
        text-decoration: underline;
      }
    }
    @media screen and (max-width: 768px) {
      padding-top: 20px;
      justify-content: flex-start;
    }
  }
  .reserve-content {
    margin-top: 25px;
    padding: 15px 35px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 20px;
    border-top: 1px solid #E5E5E5;
    @media screen and (max-width: 992px) {
      padding: 20px 0;
    }
    @media screen and (max-width: 768px) {
      margin-top: 15px;
      padding: 15px 0;
    }
    @media screen and (max-width: 576px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;