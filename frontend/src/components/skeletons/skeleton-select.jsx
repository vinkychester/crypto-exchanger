import React from "react";
import Select, { Option } from "rc-select";
// import Spinner from "../spinner/spinner.component";

import { StyledSkeletonBg } from "../styles/styled-skeleton-bg";
import { StyledSkeletonSelect } from "./styled-skeleton";
import { StyledSelect, StyledSelectLabel } from "../styles/styled-select";

const SelectSkeleton = ({label, labelWidth, optionWidth,  margin, className})  => {
  return (
    <StyledSkeletonSelect margin={margin} >
      <StyledSelect className={className}>
        {label === 'skeleton' ?
          <StyledSelectLabel>
            <StyledSkeletonBg
              width={labelWidth}
              height="18"
              color="theme"
            />
          </StyledSelectLabel> : label && <StyledSelectLabel className="skeleton-label">{label}:</StyledSelectLabel>}
        <Select
          disabled
          className="custom-select"
          defaultValue="loading"
        >
          <Option
            value="loading"
            label="loading"
          >
            <div className="option-select-item">
              <div className="default-spinner">
                {/*<Spinner
                  color="#EC6110"
                  type="moonLoader"
                  size="22px"
                />*/}
              </div>
              <StyledSkeletonBg
                width={optionWidth}
                height="26"
              />
            </div>
          </Option>
        </Select>
      </StyledSelect>
    </StyledSkeletonSelect>
  );
};

export default SelectSkeleton;