import React from "react";
import SkeletonInput from "../../skeletons/skeleton-input";

import { StyledTabInputWrapper } from "../styled-calculator";

const CalculatorSkeletonInput = () => {
  return (
    <StyledTabInputWrapper className="exchange-data">
      <div
        className="exchange-data__input"
        data-currency=""
      >
        <SkeletonInput label="skeleton" width="16"/>
      </div>
      <div className="exchange-data__min-max">
        <p>
          Min.:{" "}
          <span>
            recount...
          </span>{" "}
          / Max.:{" "}
          <span>
            recount...
          </span>
        </p>
        <p>
          The transfer fee: 0, ome banks may take extra transfer fee.
          за перевод
        </p>
      </div>
    </StyledTabInputWrapper>
  );
};
export default CalculatorSkeletonInput;