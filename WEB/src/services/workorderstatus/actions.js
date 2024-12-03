import * as types from './actionTypes'
import request from 'helpers/request'

import apiPaths from 'apiPaths'
import _ from 'lodash'

export const getAllWorkorderStatus = () => dispatch => {
    dispatch({ type: types.GET_ALL_WORKORDER_STATUS_REQUEST });
    request
        .get(apiPaths.workorderstatus.getworkorderstatus)
        .then(({ data }) => {
            dispatch({
                type: types.GET_ALL_WORKORDER_STATUS,
                payload: data,
            });
        }).catch(error => {
            dispatch({
                type: types.GET_ALL_WORKORDER_STATUS_ERROR,
                error,
            })
        });
};



