import styled from "styled-components";

const inputStyleTemplate = () => {
  return `
    width: 100%;
    padding: 14px 12px;
    font-size: 14px;
    background-color: transparent;
    border: 1px solid #9DA6B6;
    border-radius: 5px;
    &:focus, &:active {
      box-shadow: 0 6px 10px rgba(120, 141, 172, 0.6);
    }
    &::placeholder {
      opacity: 0.2;
    }
    /*&:-webkit-autofill {
      -webkit-box-shadow: inset 0 0 0 50px black;
      -webkit-text-fill-color: blue;
    }*/
    &:read-only {
      color: gray;
    }
    &:read-only:focus{
      box-shadow: none;
      background-color: transparent;
    }
  `;
};

export const StyledInputGroup = styled.div`
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  ${({type}) => type === 'hidden' && `
    height: 0;
    margin: 0 !important;
    visibility: hidden;
    opacity: 0;
  `};
`;

export const StyledLabel = styled.label`
  margin-bottom: 5px;
  color: #121026;
  font-size: 12px;
  text-align: left;
  text-transform: capitalize;
`;

export const StyledInputWrapper = styled.div`
  position: relative;
`;

export const StyledTextarea = styled.textarea`
  height: 125px;
  color: ${({theme}) => theme.text};
  font-family: inherit;
  resize: none;
  border: none;
  outline: none;
  ${inputStyleTemplate}
`

export const StyledInput = styled.input`
  ${inputStyleTemplate}
`;

export const StyledDelayInput = styled.div`
  input {
    font-family: inherit;
    ${inputStyleTemplate}
  }
`;

export const StyledPasswordEye = styled.span`
  margin: 0;
  padding: 0;
  color: #9DA6B6;
  font-size: 22px;
  position: absolute;
  bottom: 9px;
  right: 12px;
  cursor: pointer;
  &:hover {
    color: #121026;
  }
`;

export const StyledError = styled.div`
  padding: 5px 0 0;
  color: #FF5B5B;
  font-size: 12px;
  text-align: left;
`;

export const StyledSkeletonInput = styled.div`
  width: 100%;
  height: 49px;
  padding: 10px 12px;
  background-color: transparent;
  border: 1px solid #9DA6B6;
  border-radius: 5px;
  & > div {
    margin: 0;
  }
`;