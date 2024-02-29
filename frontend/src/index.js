import React from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { I18nProvider, locales } from "./i18n";

import './index.css';
import client from "./client";
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <I18nProvider locale={locales.ENGLISH}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
      </I18nProvider>
    </ApolloProvider>
  </BrowserRouter>, 
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
