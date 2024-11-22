import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import lead from 'services/lead';
import client from 'services/client';
import workorder from 'services/workorder';
import schedule from 'services/schedule';
import invoice from 'services/invoice';
import payment from 'services/payment';
import team from 'services/team';
import user from 'services/user';
import role from 'services/role';
import scheduletype from 'services/scheduletype';
import equipment from 'services/equipment';
import workorderstatus from 'services/workorderstatus';
import item from 'services/item';
import qrcode from 'services/qrcode';
import purchaseorder from 'services/purchaseorder';
import dashboard from 'services/dashboard';

import login from 'services/login';


const appReducer = combineReducers({
    lead,
    client,
    workorder,
    schedule,
    invoice,
    payment,
    team,
    scheduletype,
    user,
    role,
    equipment,
    login,
    item,
    dashboard,
    purchaseorder,
    qrcode,
    workorderstatus,
    routing: routerReducer
});

const rootReducer = (state, action) => {
    if (action.type === 'USER_LOGOUT') {
        const { routing } = state;
        state = { routing };
    }
    return appReducer(state, action);
};

export default rootReducer;