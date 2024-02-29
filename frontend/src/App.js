import React, { Suspense } from "react";
import { useApolloClient } from "@apollo/client";
import { BrowserRouter as Router, Redirect, Switch } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import Header from "./components/header/header.component";
import LoadRouteComponent from "./components/load-router/load-route.component";

import routes from "./routes";

import { GlobalStyle } from "./components/styles/global-style";
import "./assets/fonts/Montserrat/stylesheet.css"
import "./assets/fonts/Icons/style.css";
import "./assets/fonts/Exchange-icons/style.css"
import "./assets/css/rc-select.css"
import "rc-tooltip/assets/bootstrap.css";
import "rc-dropdown/assets/index.css";
import "rc-checkbox/assets/index.css";
import "rc-switch/assets/index.css";
import "rc-tabs/assets/index.css";
import 'rc-notification/assets/index.css';
import "rc-drawer/assets/index.css";
import "rc-pagination/assets/index.css";

import { GET_USER_CACHE_DETAILS } from "./graphql/queries/user.query";

function App() {
  const client = useApolloClient();

  const { userRole, userId, username } = client.readQuery({
    query: GET_USER_CACHE_DETAILS,
  });

  console.log(userRole, userId, username);

  return (
    <>
      <HelmetProvider>
        <Router>
          <Header />
          <Suspense fallback="loading">
            <Switch>
              {routes.map((route, i) => (
                <LoadRouteComponent key={i} {...route} />
              ))}
              {/* <Redirect to="/404" /> */}
            </Switch>
          </Suspense>
        </Router>
        <GlobalStyle/>
      </HelmetProvider>
    </>
  );
}

export default App;
