import { ApolloClient, InMemoryCache, createHttpLink, gql } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import jwt_decode from "jwt-decode";

import { GET_USER_CACHE_DETAILS } from "./graphql/queries/user.query";

const httpLink = createHttpLink({
  uri: "/api/graphql",
});

const cache = new InMemoryCache();

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  if (token) {
    const { exp } = jwt_decode(token);
    const expirationTime = (exp * 1000) - 60000;
    if (Date.now() >= expirationTime) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  }
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

// Connecting our site to the GraphQl API
const client = new ApolloClient({
  onError: ({ graphQLErrors, networkError, operation, forward }) => {

  },
  cache,
  link: authLink.concat(httpLink),
  // typeDefs,
  // resolvers,
});

const token = localStorage.getItem('token');

cache.writeQuery({
  query: GET_USER_CACHE_DETAILS,
  data: {
    isLoggedIn: !!token,
    userId: !token ? "" : jwt_decode(token).id,
    userRole: !token ? "anonymous" : jwt_decode(token).role,
    username: !token ? "" : jwt_decode(token).username,
  },
});

export default client;