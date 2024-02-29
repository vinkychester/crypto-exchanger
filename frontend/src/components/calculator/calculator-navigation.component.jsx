import React, { useContext } from "react";
import { useQuery } from "@apollo/client";

import CalculatorSkeletonNavigation from "./skeleton/calculator-skeleton-navigation";

import { StyledTabNavigation, StyledTabNavItem } from "./styled-calculator";

import { GET_PAIR_UNIT_TABS } from "../../graphql/queries/pair-unit-tab.query";
import { CalculatorTabContext } from "./calculator.container";
import { CalculatorContentContext } from "./calculator-tab.component";

const CalculatorNavigation = () => {
  const { tab, direction } = useContext(CalculatorTabContext);
  const { handleChangeTab } = useContext(CalculatorContentContext);

  const { data, loading, error } = useQuery(GET_PAIR_UNIT_TABS);

  if (loading) return <CalculatorSkeletonNavigation />;
  if (error) return "Error";
  if (!data) return "Not found";

  const { pairUnitTabs } = data;

  return (
    <StyledTabNavigation>
      {pairUnitTabs &&
        pairUnitTabs.map(({ id, name }) => (
          <React.Fragment key={id}>
            <StyledTabNavItem
              className={name === tab && "selected"}
              onClick={() => handleChangeTab(name)}
            >
              {name}
            </StyledTabNavItem>
          </React.Fragment>
        ))}
      <StyledTabNavItem
        className={"all" === tab && "selected"}
        onClick={() => handleChangeTab("all")}
      >
        all
      </StyledTabNavItem>
    </StyledTabNavigation>
  );
};

export default React.memo(CalculatorNavigation);
