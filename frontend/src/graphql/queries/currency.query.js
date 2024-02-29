import { gql } from "@apollo/client";

import {
  CURRENCY_ASSET_COLLECTION_FRAGMENT,
  CURRENCY_RATES_FRAGMENT,
} from "../fragments/currency.fragment";

const GET_CURRENCIES = gql`
  query GetCurrencies($page: Int, $itemsPerPage: Int, $tag: String) {
    currencies(page: $page, itemsPerPage: $itemsPerPage, tag: $tag) {
      collection {
        id
        ...CurrencyAsset
        ...CurrencyRates
      }
      paginationInfo {
        itemsPerPage
        lastPage
        totalCount
      }
    }
  }
  ${CURRENCY_ASSET_COLLECTION_FRAGMENT}
  ${CURRENCY_RATES_FRAGMENT}
`;

export { GET_CURRENCIES };
