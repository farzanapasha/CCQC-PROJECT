import * as types from './actionTypes'
import request from 'helpers/request'

import apiPaths from 'apiPaths'
import _ from 'lodash'


export const getTodaysAppoinment = () => dispatch => {
    dispatch({ type: types.GET_APPOINMENT_REQUEST });
    request
        .get(apiPaths.dashboard.getworkorderbyteam)
        .then(({ data }) => {
            dispatch({
                type: types.GET_APPOINMENT,
                payload: data,
            });
        }).catch(error => {
            dispatch({
                type: types.GET_APPOINMENT_ERROR,
                error,
            })
        });
};

export const getTopInsights = () => dispatch => {
    dispatch({ type: types.GET_INSIGHTS_REQUEST });
    request
        .get(apiPaths.dashboard.gettopinsights)
        .then(({ data }) => {
            dispatch({
                type: types.GET_INSIGHTS,
                payload: data,
            });
        }).catch(error => {
            dispatch({
                type: types.GET_INSIGHTS_ERROR,
                error,
            })
        });
};
