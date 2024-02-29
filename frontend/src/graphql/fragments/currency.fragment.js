import { gql } from "@apollo/client";

const CURRENCY_ASSET_COLLECTION_FRAGMENT = gql`
  fragment CurrencyAsset on CurrencyCollection {
    asset
    tag
  }
`;

const CURRENCY_ASSET_ITEM_FRAGMENT = gql`
  fragment CurrencyAssetItem on CurrencyItem {
    asset
    tag
  }
`;

const CURRENCY_ASSET_FRAGMENT = gql`
  fragment CurrencyAssetItem on Currency {
    asset
    tag
  }
`;

const CURRENCY_DETAILS_FRAGMENT = gql`
  fragment CurrencyDetails on CurrencyCollection {
    ...CurrencyAsset
    service {
      id
      name
      tag
    }
  }
  ${CURRENCY_ASSET_COLLECTION_FRAGMENT}
`;

const CURRENCY_DETAILS_ITEM_FRAGMENT = gql`
  fragment CurrencyDetailsItem on CurrencyItem {
    ...CurrencyAssetItem
    service {
      id
      name
      tag
    }
  }
  ${CURRENCY_ASSET_ITEM_FRAGMENT}
`;

const CURRENCY_RATES_FRAGMENT = gql`
  fragment CurrencyRates on CurrencyCollection {
    rate
    paymentRate
    payoutRate
  }
`;

export {
  CURRENCY_ASSET_COLLECTION_FRAGMENT,
  CURRENCY_ASSET_FRAGMENT,
  CURRENCY_ASSET_ITEM_FRAGMENT,
  CURRENCY_RATES_FRAGMENT,
  CURRENCY_DETAILS_FRAGMENT,
  CURRENCY_DETAILS_ITEM_FRAGMENT
};
