import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom';

import Header from 'components/Header'
import Sidebar from 'components/Sidebar'

import Home from './scenes/Home'
import Leads from './scenes/Leads'
import Invoice from './scenes/Invoice'
import Payments from './scenes/Payments'
import WorkOrder from './scenes/WorkOrder'
import Team from './scenes/Team'
import Clients from './scenes/Clients'
import Users from './scenes/Users'
import Demography from './scenes/Demography'
import NoMatch from 'components/NoMatch'


import './style'

const Dashboard = () => (
    <React.Fragment>

        <div>
            <Header />
            <div id="wrapper" className="collapse show">
            <Sidebar />
            <Switch>
                <Route path="/dashboard" component={Home} />
                <Route path="/leads" component={Leads} />
                <Route path="/clients" component={Clients} />
                <Route path="/team" component={Team} />
                <Route path="/users" component={Users}/>
                <Route path="/invoice" component={Invoice} />
                <Route path="/workorder" component={WorkOrder} />
                <Route path="/payments" component={Payments} />
                <Route path="/demography" component={Demography} />
                <Route component={NoMatch} />
                <Redirect exact from="/" to="/dashboard" />
            </Switch>
            {/* <Footer /> */}
            </div>
        </div>
    </React.Fragment>
)
export default Dashboard





