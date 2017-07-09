// @flow

import React from 'react';
import ReactDOM from 'react-dom';

// The babel-polyfill needs to come after react and react-dom in order to not break IE 11
// Refs:
// https://stackoverflow.com/questions/40897966/objects-are-not-valid-as-a-react-child-in-internet-explorer-11-for-react-15-4-1#comment69150679_40928047
// https://github.com/facebook/react/issues/8379
import 'babel-polyfill';

import configureApolloClient from 'state/configureApolloClient';
import configureClientStore from 'state/configureClientStore';
import { apiVersion, queryMap } from 'api';
import introspectionData from 'introspection.json';
import Root from './root';

/* eslint-disable no-underscore-dangle,no-undef */
const apiUri = global.__API__;

// Configure the apollo client with persisted queries.
const apolloClient = configureApolloClient(
  apiUri,
  apiVersion,
  queryMap,
  introspectionData,
);

const reduxStore: AmazeeStore<any, any> = configureClientStore(apolloClient);

// Find the DOM node generated by the server.
const mountNode = global.document.getElementById('app');

// Encapsulate rendering for hot-reloading.
const render: Function = (Component): void => {
  ReactDOM.render(
    <Component store={reduxStore} client={apolloClient} />,
    mountNode,
  );
};

if (
  module.hot &&
  module.hot.accept &&
  typeof module.hot.accept === 'function'
) {
  module.hot.accept('./root', (): void => {
    // eslint-disable-next-line global-require
    render(require('./root').default);
  });
}

// Do the initial rendering.
render(Root);
