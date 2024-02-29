import React from "react";

import { StyledContainer } from "../../components/styles/styled-container";
import ChangePasswordContainer from "../../components/change-password/change-password.container";

const ChangePasswordPage = () => {
  return (
    <StyledContainer>
      <ChangePasswordContainer />
    </StyledContainer>
  );
};

export default React.memo(ChangePasswordPage);
