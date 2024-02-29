import React from "react";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import AlertMessage from "../../components/alert/alert.component";
import Rates from "../../components/rates/rates.component";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledMainTitle } from "../../components/styles/styled-title";
import { StyledRatesWrapper } from "../../components/rates/styled-rates";

const RatesPage = () => {
  return (
    <StyledContainer>
      <Helmet>
        <title>
          Cryptocurrency rates online. Cryptocurrency rate against the dollar, euro, ruble, hryvnia | BuyCoin.Cash
        </title>
        <meta
          name="description"
          content="Cryptocurrency exchange rates in real time ☑️ The rate of Bitcoin (BTC), Ethereum (ETH), Litecoin (LTC) and other cryptocurrencies. Cryptocurrency price today."
        />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <StyledRatesWrapper>
        <StyledMainTitle size="24" className="rate-title">
          Cryptocurrency rates
        </StyledMainTitle>
        <AlertMessage
          margin="0 0 20px"
          type="info"
          message={<>
            <ul>
              <li>
                More details about the limits can be found <NavLink to="/" className="default-link">here</NavLink>.
              </li>
              <li>
                The rates on this page may not match the actual rates at the time of the application submission.
              </li>
              <li>
                For each transaction, the commission is equivalent to cryptocoins, some banks may take extra.
                commission. The cost is also taken into account, if +% is our surcharge (green), -% is your surcharge
                (red).
              </li>
            </ul>
          </>}
        />
        <Rates />
      </StyledRatesWrapper>
    </StyledContainer>
  );
};

export default React.memo(RatesPage);
