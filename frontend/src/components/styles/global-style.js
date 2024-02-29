import { createGlobalStyle } from "styled-components";

const mainFont = "Montserrat, sans-serif";
const mainFontSize = "14px";

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: ${mainFont};
    font-size: ${mainFontSize};
    letter-spacing: 0.2px;
    line-height: 22px;
    color: #110F25;
    background: #fff;
  }

  h1, h2, h3, h4, h5, h6, p, span, select, input {
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
  }

  ul, ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  input, select {
    color: #110F25;
  }

  input::-webkit-search-decoration,
  input::-webkit-search-cancel-button,
  input::-webkit-search-results-button,
  input::-webkit-search-results-decoration {
    display: none;
  }

  button {
    padding: 0;
    font: inherit;
    background-color: transparent;
    cursor: pointer;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  a:hover, a:focus, a:active {
    text-decoration: none;
  }

  .default-link {
    text-decoration: none;
    transition: all .1s ease;
    cursor: pointer;
    &:hover, &:focus, &:active {
      text-decoration: underline;
    }
  }

  .red {
    color: #FE6A74;
  }
  .green {
    color: #4FBAA8;
  }

  //Progressbar custom style
  #nprogress .bar {
    height: 3px;
    background: #110F25;
  }

  #nprogress .peg {
    box-shadow: 0 0 10px #110F25, 0 0 5px #110F25;
  }

  #nprogress .spinner-icon {
    display: none;
    border-top-color: #110F25;
    border-left-color: #110F25;
  }

  //AntDesign drawer custom style
  .drawer.drawer-open .drawer-mask {
    opacity: 0.45;
  }

  .drawer-left .drawer-content {
    background-color: #1c1b30;
  }

  .drawer-right .drawer-content {
    background-color: #1c1b30;
  }

  //AntDesign notifications
  .rc-notification {
    padding: 0;
    transform: translateX(-50%);
    z-index: 1055;
    @media screen and (max-width: 576px) {
      width: 100%;
      padding: 0 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      transform: inherit;
      left: 0 !important;
    }

    .rc-notification-notice-close {
      color: black;
      opacity: .5;
      &:hover {
        opacity: 1;
      }
    }

    .rc-notification-notice {
      margin: 0;
      padding: 5px 20px 0 0;
      background-color: transparent;
      border-radius: 0;
      box-shadow: none;
    }

    .message-with-icon {
      padding: 15px 15px 15px 55px;
      display: inline-flex;
      border-radius: 30px;
      position: relative;
      color: #36363C;
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
    }
    .message-with-icon.success {
      background-color: #E8F7F5;
      &:before {
        content: '\\e91e';
        color: #4FBAA8;
        background-color: #D2EFEB;
      }
    }
    .message-with-icon.error {
      background-color: #FFECEE;
      &:before {
        content: '\\e91a';
        color: #FE6A74;
        font-size: 11px;
        background-color: #fbc8ce;
      }
    }
    .message-with-icon.info {
      background-color: #F0F4FD;
      &:before {
        content: '\\e948';
        color: #7482B4;
        background-color: #E0E8F4;
      }
    }
    .message-with-icon.warning {
      background-color: #FFF2EE;
      &:before {
        content: '\\e986';
        color: #FF6939;
        background-color: #ffdfd5;
      }
    }
  }
  
  //AntDesign custom tabs
  .rc-tabs-dropdown {
    color: #7482B4;
    background-color: #E0E8F4;
    border: 1px solid #7482B4;
  }
  
  .default-tabs {
    border: none;
    grid-gap: 20px;
    
    .rc-tabs-nav-more {
      display: none;
      //margin-left: 5px;
      //padding: 2px 3px;
      //color: #1c1b30;
      //font-size: 12px;
      //font-weight: 700;
      //background-color: lightblue;
      //border: 1px solid blue;
      //border-radius: 3px;
      //outline: none;
    }

    .rc-tabs-nav-list {
      .rc-tabs-tab {
        font-size: 14px;
        background: transparent;
        opacity: 0.4;

        &:hover {
          opacity: 1;
        }

        .rc-tabs-tab-btn {
          outline: none;
        }
      }

      .rc-tabs-tab-active {
        font-weight: 400;
        opacity: 1;
      }

      .rc-tabs-ink-bar {
        background: #1c1b30;
      }
      @media screen and (max-width: 576px) {
        display: grid;
        grid-template-rows: auto;
        .rc-tabs-tab {
          margin: 0px;
          padding: 5px 15px;
        }
        .rc-tabs-ink-bar {
          display: none;
        }
        .rc-tabs-tab-active {
          color: #9DA6B6;
          font-weight: 700;
          background-color: #F3F3F3;
          border: 1px solid #E5E5E5;
          border-radius: 5px;
        }
      }
    }

    .rc-tabs-content-holder {
      .rc-tabs-tabpane {
        outline: none;
      }
    }

    @media screen and (max-width: 992px) {
      grid-template-columns: 100%;
      grid-template-rows: repeat(2, auto);
    }
  }

  .default-tabs-left {
    display: grid;
    grid-template-columns: 256px auto;
    @media screen and (max-width: 992px) {
      grid-template-columns: 100%;
      grid-template-rows: auto;
    }
  }

  .default-tabs-top {
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 55px auto;
    overflow: inherit;

    .rc-tabs-nav-list {
      width: 100%;
      border-bottom: 1px solid #E5E5E5;
    }

    .rc-tabs-tab {
      margin-right: 20px;
      padding: 15px 0;

      &:last-child {
        margin: 0;
      }
    }

    .rc-tabs-tab-active {
      color: #1c1b30;
    }
    
    .rc-tabs-nav-more {
      min-width: 25px;
    }
    @media screen and (max-width: 576px) {
      grid-template-columns: 100%;
      grid-template-rows: minmax(40px, auto) auto;
    }
  }
  
  //AntDesign select
  .rc-select-item-empty {
    padding: 10px;
    //color: #fff;
    //background-color: orange;
  }
  .rc-select-selector {
    min-height: 46px;
    .rc-select-selection-overflow {
      min-height: 46px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      &-item {
        display: inline-flex;
      }
    }
    span.rc-select-selection-item, span.rc-select-selection-placeholder {
      padding: 9px 12px;
      display: flex;
    }
  }
  .rc-select-dropdown {
    border: 1px solid #E5E5E5;
    box-shadow: 0 4px 15px 4px rgba(120, 141, 172, 0.6);
    
    .rc-select-item-option {
      padding: 5px 10px;
      background: #F3F3F3;
      cursor: pointer;

      &:hover {
        color: #fff;
        background: #A7B3C1;
      }

      .option-select-item {
        display: flex;
        align-items: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;

        b {
          padding: 0 10px;
        }

        img {
          margin-right: 5px;
        }
      }
    }

    .rc-select-item-option-selected {
      color: #fff;
      background: #1c1b30;

      .rc-select-item-option-state {
        display: none;
      }
    }
  }

  //AntDesign switch
  .default-switch {
    background-color: #F3F3F3;
    border-color: #E5E5E5;
    &:focus {
      box-shadow: none;
    }
  }

  .rc-switch-checked {
    background-color: #E0E8F4;
    border-color: #7482B4;
    &:after {
      background-color: #fff;
    }
  }

  //AntDesign custom checkbox
  .default-checkbox {
    input {
      width: 17px;
      height: 17px;

      &:focus {
        box-shadow: none;
        outline: none;
      }
    }

    .rc-checkbox-inner {
      width: 17px;
      height: 17px;
      border-color: #1c1b30;
      &:after {
        border: none
      }
    }
  }

  .rc-checkbox-checked {
    .rc-checkbox-inner {
      background-color: #1c1b30;

      &:after {
        border: 2px solid #fff;
        border-top: 0;
        border-left: 0;
      }
    }
  }
  
  //AntDesign custom submenu 
  .card-submenu {
    background-color: #F3F3F3;
    border-color: #E5E5E5;
    box-shadow: none;

    .rc-dropdown-menu-item {
      padding: 0;

      &:hover {
        background-color: #19183D;
      }
    }

    .rc-dropdown-menu-item-selected {
      background-color: orange;

      &:after {
        display: none;
      }
    }
  }

  //Animations
  @keyframes loadContent {
    0% {
      opacity: 0;
      transform: translateY(-25px);
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }
`;