import * as types from './actionTypes'
import request from 'helpers/request'

import apiPaths from 'apiPaths'
import _ from 'lodash'


export const getAllWorkOrder = () => dispatch => {
    dispatch({ type: types.GET_ALL_WORKORDER_REQUEST });
    request
        .get(apiPaths.workorder.getallworkorder)
        .then(({ data }) => {
            dispatch({
                type: types.GET_ALL_WORKORDER,
                payload: data,
            });
        }).catch(error => {
            dispatch({
                type: types.GET_ALL_WORKORDER_ERROR,
                error,
            })
        });
};


export const getAllWorkOrderByClient = (reqData) => dispatch => {
    dispatch({ type: types.GET_ALL_WORKORDER_BY_CLIENT_REQUEST });
    request
        .get(apiPaths.workorder.getworkorderbyclient,reqData)
        .then(({ data }) => {
            dispatch({
                type: types.GET_ALL_WORKORDER_BY_CLIENT,
                payload: data,
            });
        }).catch(error => {
            dispatch({
                type: types.GET_ALL_WORKORDER_BY_CLIENT_ERROR,
                error,
            })
        });
};






