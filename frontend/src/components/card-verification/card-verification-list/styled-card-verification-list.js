import styled from "styled-components";

export const StyledCardVerificationListWrapper = styled.div`
  padding-top: 50px;
  .card-verification-form {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #E5E5E5;
    &__action {
      padding-top: 15px;
    }
  }
  
  .card-verification-head {
    padding-right: 66px;
    @media screen and (max-width: 992px) {
      padding-right: 51px;
    }
  }
  
  .card-verification-item {
    cursor: pointer;
    position: relative;
    &__head {
      padding-bottom: 10px;
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
      display: inline-flex;
      span {
        padding-left: 3px;
        color: #A7B3C1;
        font-size: 16px;
      }
      @media screen and (max-width: 576px) {
        margin-bottom: 10px;
      }
    }
    &__status {
      padding-top: 4px;
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


export const StyledVerificationCardImages = styled.div`
  .images_errors {
    color: #FF5B5B;
  }
  .images__head {
    padding-bottom: 10px;
    display: inline-grid;
    grid-template-columns: repeat(2, max-content);
    grid-gap: 15px;
    @media screen and (max-width: 480px) {
      padding-bottom: 15px;
      grid-template-columns: 100%;
    }
  }
  .images__body {
    display: flex;
    flex-wrap: wrap;
  }
  .image-item {
    width: 200px;
    height: 150px;
    margin: 5px 10px 5px 0;
    border: 1px solid #E5E5E5;
    border-radius: 10px;
    box-shadow: 0 4px 15px 4px rgb(0 0 0 / 10%);
    overflow: hidden;
    position: relative;
    @media screen and (max-width: 480px) {
      width: 100%;
      margin: 0 0 15px !important;
      &:last-child {
        margin-bottom: 5px;
      }
    }
    &__action {
      width: 50px;
      display: flex;
      justify-content: space-between;
      position: absolute;
      top: 7px;
      right: 7px;
    }
    .action-button {
      width: 22px;
      height: 22px;
      color: #fff;
      font-size: 16px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      background-color: transparent;
      border: none;
      border-radius: 2px;
      opacity: 0.5;
      transition: all .3s ease;
      &:hover {
        opacity: 1;
      }
    }
    .action-button_update {
      background-color: #FFA800;;
    }
    .action-button_remove {
      background-color: #FF5B5B;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
    &:last-child {
      margin: 5px 0;
    }
  }
`