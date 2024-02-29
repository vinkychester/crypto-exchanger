import styled from 'styled-components';

export const StyledSelect = styled.div`
  ${({width}) => width && `max-width: ${width}px`};
  cursor: pointer;
  .custom-select, .custom-multiselect {
    z-index: 1;
    width: 100%;
    border: 1px solid #9DA6B6;
    border-radius: 5px;
    overflow: hidden;
    .option-select-item_with-img {
      [class^='exchange-icon-'], [class*='exchange-icon-'] {
        padding-right: 10px;
        font-size: 22px;
      }
      b {
        padding-right: 5px;
      }
    }
  }
  
  .custom-multiselect {
    .rc-select-selection-item {
      margin: 5px;
      padding: 0 10px;
      display: inline-flex;
      background-color: #E0E8F4;
      border: none;
      border-radius: 15px;
      color: #7482B4;
      &:hover {
        .option-select-item {
          color: #19183D;
        }
      }
      /*&:first-child {
        margin-left: 10px;
      }*/
      .rc-select-selection-item-content {
        width: 100%;
      }
    }
    .option-select-item {
      width: 100%;
    }
  }
  
  .custom-select {
    .option-select-item {
      width: calc(100% - 30px);
      color: #19183D;
      display: flex;
      align-items: center;
      text-transform: inherit;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
  .rc-select-arrow {
    height: 100%;
    z-index: -1;
    .rc-select-arrow-icon {
      border: none;
      position: relative;
      top: 10px;
      left: -8px;
      margin: 0;
      &:before {
        content: '\\e935';
        height: 16px;
        width: 16px;
        color: #9DA6B6;
        font-size: 14px;
        font-family: 'buycoin-icon', serif;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #9DA6B6;
        border-radius: 3px;
      }
    }
  }
  .rc-select-selection-item-remove-icon {
    margin-left: 5px;
    color: #9DA6B6;
    opacity: 0.85;
    &:hover {
      opacity: 1;
    }
  }
  .rc-select-selection-search {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    
    .rc-select-selection-search-input {
      width: 100%;
      height: 100%;
      padding: 0 10px;
      background-color: transparent;
    }
  }
  .rc-select-open .rc-select-arrow .rc-select-arrow-icon:before {
    content: '\\e97c';
  }
`;

export const StyledSelectLabel = styled.div`
  margin-bottom: 5px;
  font-size: 12px;
`;