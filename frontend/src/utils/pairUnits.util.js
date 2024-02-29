const filterPairUnitsByDirection = (collection, direction) => {
  return collection.filter((item) => direction === item.direction);
};

const findByParams = (collection, asset, tag, direction) => {
  return collection.find(
    (item) =>
      item.currency.asset === asset &&
      item.paymentSystem.tag === tag &&
      item.direction === direction
  );
};

const deleteDuplicates = (collection) => {
  if (collection.length !== 0) {
    return Array.from(
      new Set(
        collection.map(
          (pairUnit) => pairUnit.currency.asset + pairUnit.paymentSystem.name
        )
      )
    ).map((signature) => {
      return collection.find(
        (pairUnitItem) =>
          pairUnitItem.currency.asset + pairUnitItem.paymentSystem.name ===
          signature
      );
    });
  }
  return {};
};

export { filterPairUnitsByDirection, deleteDuplicates, findByParams };
