import { gql } from "@apollo/client";

import {
  PAIR_UNIT_DETAILS_FRAGMENT,
  PAIR_UNIT_ITEM_DETAILS_FRAGMENT, PAIR_UNIT_WITH_SERVICE_DETAILS_FRAGMENT
} from "./pair-unit.fragment";

const PAIR_ITEM_FRAGMENT = gql`
  fragment Pair on PairItem {
    id
    payment {
      id
      ...PairUnitItemDetails
    }
    payout {
      id
      ...PairUnitItemDetails
    }
  }
  ${PAIR_UNIT_ITEM_DETAILS_FRAGMENT}
`;

const PAIR_COLLECTION_FRAGMENT = gql`
  fragment PairCollection on PairCollection {
    payment {
      id
      ...PairUnitWithServiceDetails
    }
    payout {
      id
      ...PairUnitWithServiceDetails
    }
  }
  ${PAIR_UNIT_WITH_SERVICE_DETAILS_FRAGMENT}
`;

const PAIR_DETAILS_FRAGMENT = gql`
  fragment PairDetails on PairCollection {
    isActive
    percent
    ...PairCollection
  }
  ${PAIR_COLLECTION_FRAGMENT}
`;

export { PAIR_ITEM_FRAGMENT, PAIR_COLLECTION_FRAGMENT, PAIR_DETAILS_FRAGMENT };
