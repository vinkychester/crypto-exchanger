import React from "react";
import { FormattedMessage } from "react-intl";

import { StyledCardInfoItem } from "../../styles/styled-card";

const RequisitionDetailsBankTab = ({ bankDetails }) => {
  const { collection } = bankDetails;

  if (!collection.length) return <></>;

  return (
    collection && collection.map(({ attributes }) =>
      attributes.map(
        ({ id, name, value, isHidden, ...props }) =>
          !isHidden && value !== "" &&
          <FormattedMessage key={id} id={name}>
            {txt =>
              <StyledCardInfoItem data-title={txt}>
                {value}
              </StyledCardInfoItem>}
          </FormattedMessage>
      )
    )
  );
};

export default React.memo(RequisitionDetailsBankTab);
