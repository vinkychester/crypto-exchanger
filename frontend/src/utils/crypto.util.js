const convertToUSD = (tag, profit, rate) => {
  return tag === "CRYPTO"
    ? Math.round(profit * rate * 100) / 100
    : Math.round((profit / rate) * 100) / 100;
};

const convertToUSDWithUSD = (tag, profit, rate) => {
  return tag === "CRYPTO"
    ? Math.round(profit * rate * 100) / 100 + " USDT"
    : Math.round((profit / rate) * 100) / 100 + " USD";
};

const validateCryptoWallet = (asset, wallet) => {
  let WAValidator = require("multicoin-address-validator");
  if (asset === "USDT") asset = "ETH";
  if (asset === "USDT (ERC20)") asset = "ETH";
  if (asset === "USDT (OMNI)") asset = "BTC";
  if (asset === "USDT (TRC20)") asset = "TRX";
  return WAValidator.validate(wallet, asset);
};

export { convertToUSD, convertToUSDWithUSD, validateCryptoWallet };
