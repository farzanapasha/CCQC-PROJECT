import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import { loadState } from 'helpers/localstorage';

import { store } from 'store';

import Dashboard from 'scenes/Dashboard'

import Login from 'components/Login'
import Logout from 'components/Logout'

const App = () => {
    return (
        <Provider store={store}>
            <Router>
                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route exact path="/logout" component={Logout} />
                    <Route path="/" render={() => (
                        (loadState() === undefined) ? (
                            <Redirect to="/" />
                        ) : (<Dashboard />))}
                    />
                </Switch>
            </Router>
        </Provider>
    )
}

export default App