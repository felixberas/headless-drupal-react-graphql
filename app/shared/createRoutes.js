/* eslint-disable global-require */

/**
 * create routes
 *
 * @flow
 */
import Relay from 'react-relay';
import App from 'App';
import { IndexRoute, Route } from 'react-router';
import { injectAsyncReducer } from 'configureStore';

const errorLoading = (error) => console.error('Dynamic page loading failed.', error); // eslint-disable-line no-console
const loadModule = (callback) => (module) => callback(null, module.default);
const loadReducer = (store, name) => (module) => injectAsyncReducer(store, name, module.default); // eslint-disable-line no-unused-vars

const childRoutes = (): Route[] => [{
  path: '/articles',
  queries: {
    articles: () => Relay.QL`query {
      allArticles
    }`,
  },
  getComponent: (location: Object, callback: Function) => {
    if (__CLIENT__) {
      System.import('App/screens/Articles')
        .then(loadModule(callback))
        .catch(errorLoading);
    } else {
      callback(null, require('App/screens/Articles').default);
    }
  },
}];

export default (store): IndexRoute => ({ // eslint-disable-line no-unused-vars
  path: '/',
  component: App,
  indexRoute: {
    getComponent: (location: Object, callback: Function) => {
      if (__CLIENT__) {
        System.import('App/screens/Home')
          .then(loadModule(callback))
          .catch(errorLoading);
      } else {
        callback(null, require('App/screens/Home').default);
      }
    },
  },

  childRoutes: [...childRoutes(), {
    path: '*',
    getComponent: (location: Object, callback: Function) => {
      if (__CLIENT__) {
        System.import('App/screens/NotFound')
          .then(loadModule(callback))
          .catch(errorLoading);
      } else {
        callback(null, require('App/screens/NotFound').default);
      }
    },
  }],
});
