import React from 'react';
import Spinner from '../spinner/spinner.component';

import { StyledInputGroup, StyledInputWrapper, StyledLabel, StyledSkeletonInput } from '../input-group/styled-input-group';
import { StyledSkeletonBg } from "../styles/styled-skeleton-bg";

const SkeletonInput = ({label, width, className}) => {
  return (
    <StyledInputGroup className={`input-group ${className}`}>
      {label === 'skeleton' ?
        <StyledLabel>
          <StyledSkeletonBg
            width={width}
            height="22"
          />
        </StyledLabel> : label && <StyledLabel>{label}:</StyledLabel>}
      <StyledInputWrapper>
        <StyledSkeletonInput>
          <Spinner color="#9DA6B6" size="30px" />
        </StyledSkeletonInput>
      </StyledInputWrapper>
    </StyledInputGroup>
  );
};

export default SkeletonInput;