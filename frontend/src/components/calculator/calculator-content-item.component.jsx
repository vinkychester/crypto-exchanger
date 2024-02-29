import React, { useContext, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useHistory } from "react-router-dom";

import { StyledTabContentItem, StyledTabWrapper } from "./styled-calculator";

import { CalculatorContext } from "./calculator.container";
import { CalculatorTabContext } from "./calculator.container";
import { CalculatorContentContext } from "./calculator-tab.component";
import { isActive } from "../../utils/calculator.util";

const CalculatorContentItem = ({ match, collection, data }) => {
  const history = useHistory();

  const {
    isHandleSwap,
    handleChangeExchangeValue,
    handleChangeCollection,
    handleChangeRequisitionDetails,
  } = useContext(CalculatorContext);
  const { tab, direction, exchangeValue, inverseExchangeValue } = useContext(CalculatorTabContext);
  const { exchangeItem, handleChangeTab, handleChangeExchangeItem } = useContext(CalculatorContentContext);

  const regexp = /^([a-z-_0-9&]+)-to-([a-z-_0-9&]+)/g;
  const bestChangeRegexp = /cur_from=[A-Za-z0-9]*&cur_to=[A-Za-z0-9]*/g;

  useEffect(() => {
    const param = match.params.id;
    if (data) {
      let element = undefined;
      const { collection } = data.pairUnits;
      const { search } = history.location;

      handleChangeCollection(collection, direction);

      if (collection.length !== 0) {
        if (search && search.match(bestChangeRegexp)) {
          const str = search.match(bestChangeRegexp)[0].split("&");

          let link =
            "payment" === direction
              ? str[0].split("=")[1]
              : str[1].split("=")[1];
          let unit = collection.find(
            (item) => item.currency.asset === link.slice(-3)
          );

          const isFiat = !!(unit && unit.currency.tag === "CURRENCY");

          let paymentSystem = link;
          let asset = link;

          if (link.includes("USDT")) {
            paymentSystem = link.slice(0, 4);
            asset =
              link.slice(4) === "ERC"
                ? "USDT (ERC20)"
                : link.slice(4) === "TRC"
                ? "USDT (TRC20)"
                : link.slice(4) === "OMNI"
                ? "USDT (OMNI)"
                : "USDT";
          }

          element = collection.find(
            (item) =>
              asset === item.currency.asset &&
              paymentSystem ===
                (isFiat ? item.paymentSystem.tag : item.paymentSystem.subName)
          );
        }

        if (param) {
          const array = [...param.matchAll(regexp)];

          if (array.length !== 0) {
            let link = "payment" === direction ? array[0][1].split("-") : array[0][2].split("-");
            let asset = link[0];

            if (asset.includes("usdt")) {
              asset =
                asset.slice(4) === "erc20"
                  ? "usdt (erc20)"
                  : asset.slice(4) === "trc20"
                  ? "usdt (trc20)"
                  : asset.slice(4) === "omni"
                  ? "usdt (omni)"
                  : "usdt";
            }

            element = collection.find(
              (item) =>
                asset === item.currency.asset.toLowerCase() &&
                link[1] ===
                  (item.currency.tag === "CRYPTO"
                    ? item.paymentSystem.subName.toLowerCase()
                    : item.paymentSystem.tag.toLowerCase())
            );
          }
        }

        if ((search && search.match(bestChangeRegexp)) || param) {
          if (element) {
            const { name } = element.pairUnitTabs;
            handleChangeTab(name);
            handleChangeExchangeItem(element);
          } else {
            handleChangeTab("all");
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!isHandleSwap) {
      if (collection.length !== 0) {
        if (exchangeItem) handleChangeExchangeValue(exchangeItem, direction);
        else handleChangeExchangeValue(collection[0], direction);
      } else {
        handleChangeExchangeValue(undefined, direction);
        handleChangeRequisitionDetails("pair", undefined);
      }
    }
  }, [tab, exchangeItem]);

  if (!collection.length) {
    window.history.pushState({}, document.title, "/");
    return "Not found";
  }

  const renderClassname = (id, isActive) => {
    if (isActive && exchangeValue && exchangeValue.id === id)
      return "exchange-item_current";
    if (exchangeValue && exchangeValue.id === id)
      return "exchange-item_current exchange-item_no-exchange";
    if (!isActive) return "exchange-item_no-exchange";
    return null;
  };

  return (
    <StyledTabWrapper>
      {collection &&
        collection.map((node) => {
          const { id, currency, paymentSystem } = node;
          const { asset } = currency;
          const { tag, name } = paymentSystem;
          return (
            <React.Fragment key={id}>
              <StyledTabContentItem
                className={renderClassname(
                  id,
                  isActive(inverseExchangeValue, node)
                )}
                onClick={() => handleChangeExchangeValue(node, direction)}
              >
                <div className={`exchange-icon-${paymentSystem.tag === "CRYPTO" ? asset : tag}`} />
                <div className="exchange-item-name">
                  {name}
                </div>
                <div className="exchange-item-currency">
                  {asset}
                </div>
              </StyledTabContentItem>
            </React.Fragment>
          );
        })}
    </StyledTabWrapper>
  );
};

export default React.memo(withRouter(CalculatorContentItem));
