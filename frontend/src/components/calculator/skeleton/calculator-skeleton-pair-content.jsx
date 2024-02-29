import React from "react";

import { StyledCalcSkeletonContent } from "./styled-skeleton-calculator";
import { StyledSkeletonBg } from "../../styles/styled-skeleton-bg";
import CalculatorSkeletonInput from "./calculator-skeleton-input";

const CalculatorSkeletonPairContent = () => {
  const repeat = 5;

  return (
    <>
      <StyledCalcSkeletonContent>
        {Array.from(new Array(repeat)).map(() => (
          <StyledSkeletonBg
            borderRadius="5"
            key={Math.random()}
            height="45"
            first
          />
        ))}
      </StyledCalcSkeletonContent>
      <CalculatorSkeletonInput/>
    </>
  );
};

export default CalculatorSkeletonPairContent;
