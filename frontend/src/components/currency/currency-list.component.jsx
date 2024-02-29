import React, { useContext } from "react";
import { useQuery } from "@apollo/client";

import CurrencyItem from "./currency-item.component";

import { GET_CURRENCIES } from "../../graphql/queries/currency.query";
import { CurrencyFilterContext } from "./currency.container";

const CurrencyList = () => {
  const { tag } = useContext(CurrencyFilterContext);

  const { loading, error, data } = useQuery(GET_CURRENCIES, {
    variables: { tag },
    fetchPolicy: "network-only",
  });

  if (loading) return "loading...";
  if (error) return "Error";
  if (!data) return "Not found";

  const { collection, paginationInfo } = data.currencies;

  if (!collection.length) return "No currencies";

  return (
    <>
      <p>Abbreviation</p>
      <p>Rate</p>
      <p>Payment rate</p>
      <p>Payout rate</p>
      {collection &&
        collection.map(({ id, ...props }) => (
          <CurrencyItem id={id} {...props} />
        ))}
    </>
  );
};

export default React.memo(CurrencyList);
