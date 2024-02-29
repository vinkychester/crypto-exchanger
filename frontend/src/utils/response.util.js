const REACT_APP_GOOGLE_CLIENT_ID = "708407794041-n3tkms5tl6pne59ncmdtgda9olol82s1.apps.googleusercontent.com";
const mercureUrl = new URL("https://hub.itlab-studio.com/.well-known/mercure");

const parseIRI = (IRI) => {
  const regex = /\d+/i;
  return +IRI.match(regex)[0];
};

const parseUuidIRI = (IRI) => {
  return IRI.split("/")[3];
};

const hideCreditCardSigns = (cardNumber) => {
  let cardNumberFirst = cardNumber.slice(0, 6);
  let cardNumberLast = cardNumber.substr(cardNumber.length - 4);
  return cardNumberFirst + "******" + cardNumberLast;
};

const parseApiErrors = (graphQLErrors) => {
  let errors = {};

  if (graphQLErrors) {
    graphQLErrors.map(({ message, extensions }) => {
      if ("internal" === extensions.category) {
        if (message.includes(":")) {
          Object.entries(JSON.parse(message)).forEach(
            ([key, value]) => (errors[key] = value.trim())
          );
        } else {
          errors["internal"] = message;
        }
      } else if (extensions.violations) {
        extensions.violations.map(
          ({ path, message }) => (errors[path] = message)
        );
      } else if (403 === extensions.status && "user" === extensions.category) {
        errors["user"] = message;
      }
    });
  }
  return errors;
};

const getPageOnRemove = (currentPage, itemsPerPage, lastPage, totalCount, handleChangeFilter) => {
  const a = itemsPerPage ? itemsPerPage : 50;
  let calculatedPage = Math.ceil((totalCount - 1) / a);
  if (currentPage > lastPage) {
    currentPage = lastPage;
  } else if (currentPage > calculatedPage) {
    currentPage = calculatedPage;
  }
  if (currentPage < 1) return 1;
  handleChangeFilter("page", currentPage);
  return currentPage;
};

export {
  REACT_APP_GOOGLE_CLIENT_ID,
  mercureUrl,
  parseIRI,
  parseUuidIRI,
  parseApiErrors,
  hideCreditCardSigns,
  getPageOnRemove
};
