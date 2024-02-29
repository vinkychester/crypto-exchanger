import React, { useContext } from "react";

import { StyledCalculatorSwap } from "./styled-calculator";

import { CalculatorContext } from "./calculator.container";
import { findPair } from "../../utils/calculator.util";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";

const CalculatorSwap = ({ exchangeValue, collection, handleChangeSwap }) => {
  const { handleChangeExchangeValue, handleChangeTabs } = useContext(CalculatorContext);
  const { paymentCollection, payoutCollection } = collection;
  const { paymentExchangeValue, payoutExchangeValue } = exchangeValue;

  const handleSwap = () => {
    if (paymentExchangeValue && payoutExchangeValue) {
      let paymentElement = paymentCollection.find(
        (item) =>
          payoutExchangeValue.currency.asset === item.currency.asset &&
          payoutExchangeValue.paymentSystem.subName === item.paymentSystem.subName
      );
      let payoutElement = payoutCollection.find(
        (item) =>
          paymentExchangeValue.currency.asset === item.currency.asset &&
          paymentExchangeValue.paymentSystem.subName === item.paymentSystem.subName
      );
      if (
        paymentElement &&
        payoutElement &&
        findPair(paymentElement, payoutElement)
      ) {
        handleChangeSwap(true);
        handleChangeTabs("payment", paymentElement.pairUnitTabs.name)
        handleChangeTabs("payout", payoutElement.pairUnitTabs.name)
        handleChangeExchangeValue(paymentElement, "payment");
        handleChangeExchangeValue(payoutElement, "payout");
      } else {
        return closableNotificationWithClick("Swap is not available for these currencies", "error");
      }
    } else {
      return closableNotificationWithClick("Swap not available", "error");
    }
  };

  return (
    <StyledCalculatorSwap className="calculator__swap">
      <div
        onClick={handleSwap}
        className="calculator-swap__btn"
        title="Change exchange direction"
      >
        <span className="icon-exchange" />
      </div>
    </StyledCalculatorSwap>
  );
};

export default React.memo(CalculatorSwap);
