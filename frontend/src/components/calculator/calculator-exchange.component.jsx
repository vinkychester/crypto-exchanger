import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { useApolloClient } from "@apollo/client";

import Can from "../can/can.component";

import { GET_USER_CACHE_DETAILS } from "../../graphql/queries/user.query";
import {
  CalculatorContext,
  CalculatorExchangeContext,
} from "./calculator.container";
import { calculator } from "../../rbac-consts";
import { StyledButton } from "../styles/styled-button";
import { StyledCalculatorAlignBtn } from "./styled-calculator";

const CalculatorExchange = () => {
  const client = useApolloClient();

  const { pair } = useContext(CalculatorContext);
  const { isShowRequisites, isCollection, handleShowRequisites } = useContext(CalculatorExchangeContext);

  const { userRole } = client.readQuery({
    query: GET_USER_CACHE_DETAILS,
  });
  
  return (
    <StyledCalculatorAlignBtn className="calculator__footer">
      {pair && isCollection && (
        <Can
          role={userRole}
          perform={calculator.EXCHANGE}
          yes={() =>
            pair &&
            !isShowRequisites && (
              <StyledButton as="span" color="main" onClick={() => handleShowRequisites(!isShowRequisites)}>
                Exchnage
              </StyledButton>
            )
          }
          no={() => (
            <NavLink to="/login" >
              <StyledButton as="span" color="main">
                Exchnage
              </StyledButton>
            </NavLink>
          )}
        />
      )}
    </StyledCalculatorAlignBtn>
  );
};

export default React.memo(CalculatorExchange);
