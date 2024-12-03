import * as types from './actionTypes'
import request from 'helpers/request'

import apiPaths from 'apiPaths'
import _ from 'lodash'


export const getAllQRCode = () => dispatch => {
    dispatch({ type: types.GET_ALL_QRCODE_REQUEST });
    request
        .get(apiPaths.qrcode.getallqrcode)
        .then(({ data }) => {
            dispatch({
                type: types.GET_ALL_QRCODE,
                payload: data,
            });
        }).catch(error => {
            dispatch({
                type: types.GET_ALL_QRCODE_ERROR,
                error,
            })
        });
};

export const getQRCodeByClient = (params) => dispatch => {
    dispatch({ type: types.GET_QRCODE_BY_CLIENT_REQUEST });
    request
        .get(apiPaths.qrcode.getqrcodebyclient,params)
        .then(({ data }) => {
            dispatch({
                type: types.GET_QRCODE_BY_CLIENT,
                payload: data,
            });
        }).catch(error => {
            dispatch({
                type: types.GET_QRCODE_BY_CLIENT_ERROR,
                error,
            })
        });
};
