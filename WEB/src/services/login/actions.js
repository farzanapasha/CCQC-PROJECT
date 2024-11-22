import * as types from './actionTypes';
import request from 'helpers/request';
import Defines from 'config';
import apiPaths from 'apiPaths';
import { push } from 'react-router-redux'

import { saveState, clearState, promiseLoadState} from 'helpers/localstorage';

export const createSession = (token,isAuth, user) => dispatch => {
    const session = {
        isAuth: isAuth,
        token,
        user,
        loginTime: new Date(),
    };
    saveState({ session });
    dispatch({
        type: types.GET_LOGIN,
        payload: user,
    });
};

export const redirectOnSessionFail = () => (dispatch, getState) => {
    window.open(Defines.API_URL + '/api/sso/login', '_self');
    // window.open(Defines.API_URL, '_self');
};


export const destroySessionOnInvalidToken = (errMsg = null) => dispatch => {
    clearState();
    dispatch(redirectOnSessionFail());
};

export const destroySession = () => dispatch => {
    promiseLoadState().then(data=>{
        // window.open(Defines.API_URL + '/api/sso/logout?token='+data.session.token, '_self')
        clearState()
    })
    // window.open(Defines.API_URL + '/api/sso/logout', '_self')
    // request
    //     .get(apiPaths.logout)
        // .then(({data}) => {
        //     clearState()
        // })
        // .catch(error => {
        
        // })
        // clearState()
};

export const login = (params) => dispatch => {
    request
        .post(apiPaths.login,params)
        .then(({ data }) => {
            dispatch(createSession(data.data.token,data.data.isAuth, data.data.user));
            dispatch({
                type: types.GET_LOGIN,
                payload: data.data.user,
            });
        })
        .catch(error => {
            dispatch({
                type: types.GET_LOGIN_ERROR,
                payload: error,
            });
        })
};
