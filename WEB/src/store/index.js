import { applyMiddleware, createStore, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';

import rootReducer from './store.base';

export const store = createStore(
    rootReducer,
    compose(applyMiddleware(thunk, routerMiddleware(createBrowserHistory))),
);