import React from "react";
import { Helmet } from "react-helmet-async";

import CalculatorContainer from "../../components/calculator/calculator.container";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledHomeTitleWrapper } from "./styled-home";


const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Cryptocurrency exchanger: buy bitcoin, bitcoin exchange (btc), bitcoin wallet | BuyCoin.Cash</title>
        <meta
          name="description"
          content="Cryptocurrency exchanger: buy bitcoin, bitcoin (BTC) exchange for rubles, UAH (UAH), dollars (USD), bitcoin wallet. Favorable rate of purchase and sale of cryptocurrencies - BTC, USDT, ETH, TRX."
        />
        <link rel="canonical" href={'https://' + window.location.hostname} />
      </Helmet>
      <StyledContainer>
        <StyledHomeTitleWrapper>
          <h1 className="home-title">
            Cryptocurrency exchange at the best rates! With us you can buy bitcoin (btc), ethereum (eth), lightcoin (ltc) or another cryptocurrency in just two clicks.
          </h1>
        </StyledHomeTitleWrapper>
        <CalculatorContainer />
      </StyledContainer>
    </>
  )
};

export default HomePage;