import * as types from './actionTypes'
import request from 'helpers/request'

import apiPaths from 'apiPaths'
import _ from 'lodash'


export const getAllPayment = () => dispatch => {
    dispatch({ type: types.GET_ALL_PAYMENT_REQUEST });
    request
        .get(apiPaths.payment.getallpayment)
        .then(({ data }) => {
            dispatch({
                type: types.GET_ALL_PAYMENT,
                payload: data,
            });
        }).catch(error => {
            dispatch({
                type: types.GET_ALL_PAYMENT_ERROR,
                error,
            })
        });
};

export const getAllPaymentByClient = (reqData) => dispatch => {
    dispatch({ type: types.GET_PAYMENT_BY_CLIENT_REQUEST });
    request
        .get(apiPaths.payment.getpaymentbyclient,reqData)
        .then(({ data }) => {
            dispatch({
                type: types.GET_PAYMENT_BY_CLIENT,
                payload: data,
            });
        }).catch(error => {
            dispatch({
                type: types.GET_PAYMENT_BY_CLIENT_ERROR,
                error,
            })
        });
};

export const getAllPaymentByInvoice = (reqData) => dispatch => {
    dispatch({ type: types.GET_PAYMENT_BY_INVOICE_REQUEST });
    request
        .get(apiPaths.payment.getpaymentbyinvoice,reqData)
        .then(({ data }) => {
            dispatch({
                type: types.GET_PAYMENT_BY_INVOICE,
                payload: data,
            });
        }).catch(error => {
            dispatch({
                type: types.GET_PAYMENT_BY_INVOICE_ERROR,
                error,
            })
        });
};