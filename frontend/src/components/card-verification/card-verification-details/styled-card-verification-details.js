import styled from "styled-components";

export const StyledCardVerificationDetailsWrapper = styled.div`
  padding-top: 50px;
`;

export const StyledCardVerificationDetailsTitle = styled.h1`
  font-size: 24px;
  .card-verification-title {
    display: inline-grid;
    align-items: center;
    grid-gap: 5px;
    grid-template-columns: repeat(3, max-content);
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

export const StyledCardVerificationDetailsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width: 576px) {
    flex-direction: column-reverse;
    align-items: flex-start;
  }
`;

export const StyledCardVerificationDetailsDate = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .card-verification-date {
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

export const StyledCardVerificationDetailsData = styled.div`
  position: relative;
  .icon-copy {
    padding-left: 3px;
    color: #A7B3C1;
    cursor: pointer;
  }
  .card-verification-status {
    position: absolute;
    top: 5px;
    right: 0;
  }
  .card-verification-action {
    margin-top: 30px;
    padding-top: 30px;
    display: grid;
    grid-template-columns: repeat(2, max-content);
    grid-gap: 15px;
    justify-content: center;
    border-top: 1px solid #E5E5E5;

  }
  .card-verification-resend {
    margin-top: 30px;
    padding-top: 30px;
    text-align: center;
    border-top: 1px solid #E5E5E5;
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
  
  @media screen and (max-width: 576px) {
    .card-verification-status {
      text-align: center;
      margin-bottom: 15px;
      position: static;
    }
  }
`;

export const StyledCVDetailsImages = styled.div`
  display: flex;
  flex-wrap: wrap;
  .image-item {
    width: 200px;
    height: 150px;
    margin: 5px 10px 5px 0;
    border: 1px solid #E5E5E5;
    border-radius: 10px;
    box-shadow: 0 4px 15px 4px rgb(0 0 0 / 10%);
    overflow: hidden;
    position: relative;
    cursor: pointer;
    &:before {
      content: "\\e987";
      width: 100%;
      height: 100%;
      color: #fff;
      font-size: 26px;
      font-family: "buycoin-icon", serif;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 0;
      left: 0;
      background-color: rgba(25, 24, 61, 0.5);
      visibility: hidden;
      opacity: 0;
      transition: all .3s ease;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
    &:hover {
      &:before {
        visibility: visible;
        opacity: 1;
      }
    }
  }
`;