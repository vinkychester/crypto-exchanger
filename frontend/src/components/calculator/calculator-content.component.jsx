import React, { useContext } from "react";
import { useQuery } from "@apollo/client";

import CalculatorContentItem from "./calculator-content-item.component";
import CalculatorSkeletonPairContent from "./skeleton/calculator-skeleton-pair-content";

import { StyledTabContent } from "./styled-calculator";

import { GET_ACTIVE_PAIR_UNITS_BY_DIRECTION } from "../../graphql/queries/pair-unit.query";
import { CalculatorTabContext } from "./calculator.container";
import { findPairUnitsByTab } from "../../utils/calculator.util";
import { CalculatorContentContext } from "./calculator-tab.component";

const CalculatorContent = () => {
  const { direction, tab } = useContext(CalculatorTabContext);

  const includePayment = "payment" === direction;
  const includePayout = "payout" === direction;

  const { data, loading, error, refetch } = useQuery(
    GET_ACTIVE_PAIR_UNITS_BY_DIRECTION,
    {
      variables: { direction, includePayment, includePayout }
      // fetchPolicy: "network-only"
    }
  );

  if (loading) return <CalculatorSkeletonPairContent />;
  if (error) return "Error";
  if (!data) return "Not found";

  return (
    <StyledTabContent>
      <CalculatorContentItem
        collection={findPairUnitsByTab(
          data.pairUnits.collection,
          tab
        )}
        data={data}
      />
    </StyledTabContent>
  );
};

export default React.memo(CalculatorContent);