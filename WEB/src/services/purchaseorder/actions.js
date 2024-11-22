import * as types from './actionTypes'
import request from 'helpers/request'

import apiPaths from 'apiPaths'
import _ from 'lodash'


export const getAllPurchase = () => dispatch => {
    dispatch({ type: types.GET_ALL_PURCHASE_REQUEST });
    request
        .get(apiPaths.purchase.getallpurchaseorder)
        .then(({ data }) => {
            dispatch({
                type: types.GET_ALL_PURCHASE,
                payload: data,
            });
        }).catch(error => {
            dispatch({
                type: types.GET_ALL_PURCHASE_ERROR,
                error,
            })
        });
};

export const getPurchaseByClient = (params) => dispatch => {
    dispatch({ type: types.GET_PURCHASE_BY_CLIENT_REQUEST });
    request
        .get(apiPaths.purchase.getpurchaseorderbyclient,params)
        .then(({ data }) => {
            dispatch({
                type: types.GET_PURCHASE_BY_CLIENT,
                payload: data,
            });
        }).catch(error => {
            dispatch({
                type: types.GET_PURCHASE_BY_CLIENT_ERROR,
                error,
            })
        });
};
