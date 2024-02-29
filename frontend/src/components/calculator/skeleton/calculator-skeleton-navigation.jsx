import React from "react";

import { StyledCalcSkeletonNavigation } from "./styled-skeleton-calculator";
import { StyledSkeletonBg } from "../../styles/styled-skeleton-bg";

const CalculatorSkeletonNavigation = () => {
  const repeat = 4;

  return (
    <StyledCalcSkeletonNavigation>
      {Array.from(new Array(repeat)).map(() => (
        <StyledSkeletonBg
          key={Math.random()}
          border="blue"
          borderRadius="5"
          height="48"
        />
      ))}
    </StyledCalcSkeletonNavigation>
  );
};

export default CalculatorSkeletonNavigation;
