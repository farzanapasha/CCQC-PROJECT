import * as types from './actionTypes'
import request from 'helpers/request'

import apiPaths from 'apiPaths'
import _ from 'lodash'



export const getAllUser = () => dispatch => {
    dispatch({ type: types.GET_ALL_USER_REQUEST });
    request
        .get(apiPaths.user.getalluser)
        .then(({ data }) => {
            dispatch({
                type: types.GET_ALL_USER,
                payload: data,
            });
        }).catch(error => {
            dispatch({
                type: types.GET_ALL_USER_ERROR,
                error,
            })
        });
};



