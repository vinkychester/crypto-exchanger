const __splitAsset = (asset) => {
  return asset.split(/\(/).join('').split(/\)/).join('').replace(/\s/g, "");
};

const generateUrl = (payment, payout) => {
  if (!payment || !payout) return;

  let paymentAsset = __splitAsset(payment.currency.asset);
  let payoutAsset = __splitAsset(payout.currency.asset);

  return `${paymentAsset}-${
    payment.currency.tag === 'CRYPTO'
      ? payment.paymentSystem.subName
      : payment.paymentSystem.tag
  }-to-${payoutAsset}-${
    payout.currency.tag === 'CRYPTO'
      ? payout.paymentSystem.subName
      : payout.paymentSystem.tag
  }`.toLocaleLowerCase();
};

const findPairUnitsByTab = (collection, tab) => {
  if ("all" === tab) return collection;
  return collection.filter(item => item.pairUnitTabs.name === tab);
};

const findPair = (payment, payout) => {
  const { collection: paymentCollection } = payment.paymentPairs;
  const { collection: payoutCollection } = payout.payoutPairs;

  for (let i = 0; i < paymentCollection.length; i++) {
    for (let k = 0; k < payoutCollection.length; k++) {
      if (paymentCollection[i].id === payoutCollection[k].id) {
        return paymentCollection[i].id;
      }
    }
  }

  return undefined;
};

const isActive = (exchangeValue, node) => {
  if (!exchangeValue || !node) return false;

  const { collection: exchangeValueCollection } = exchangeValue[`${exchangeValue.direction}Pairs`];
  const { collection: nodeCollection } = node[`${node.direction}Pairs`];

  if (!exchangeValueCollection.length || !nodeCollection.length) return false;

  for (let i = 0; i < exchangeValueCollection.length; i++) {
    for (let k = 0; k < nodeCollection.length; k++) {
      if (exchangeValueCollection[i].id === nodeCollection[k].id) {
        return true;
      }
    }
  }

  return false;
};

export { generateUrl, findPairUnitsByTab, findPair, isActive };