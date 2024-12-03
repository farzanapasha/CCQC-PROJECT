import * as types from './actionTypes'
import request from 'helpers/request'

import apiPaths from 'apiPaths'
import _ from 'lodash'



export const getAllInvoice = () => dispatch => {
    dispatch({ type: types.GET_ALL_INVOICE_REQUEST });
    request
        .get(apiPaths.invoice.getallinvoice)
        .then(({ data }) => {
            dispatch({
                type: types.GET_ALL_INVOICE,
                payload: data,
            });
        }).catch(error => {
            dispatch({
                type: types.GET_ALL_INVOICE_ERROR,
                error,
            })
        });
};

export const getAllInvoiceByClient = (reqData) => dispatch => {
    dispatch({ type: types.GET_INVOICE_BY_CLIENT_REQUEST });
    request
        .get(apiPaths.invoice.getinvoicebyclient,reqData)
        .then(({ data }) => {
            dispatch({
                type: types.GET_INVOICE_BY_CLIENT,
                payload: data,
            });
        }).catch(error => {
            dispatch({
                type: types.GET_INVOICE_BY_CLIENT_ERROR,
                error,
            })
        });
};



export const getAllInvoiceByWorkOrder = (reqData) => dispatch => {
    dispatch({ type: types.GET_INVOICE_BY_WORKORDER_REQUEST });
    request
        .get(apiPaths.invoice.getinvoicebyworkorder,reqData)
        .then(({ data }) => {
            dispatch({
                type: types.GET_INVOICE_BY_WORKORDER,
                payload: data,
            });
        }).catch(error => {
            dispatch({
                type: types.GET_INVOICE_BY_WORKORDER_ERROR,
                error,
            })
        });
};
