import React from "react";

const CurrencyItem = ({ asset, rate, paymentRate, payoutRate }) => {
  return (
    <>
      {asset}
      {rate}
      {paymentRate}
      {payoutRate}
    </>
  );
};

export default React.memo(CurrencyItem);
