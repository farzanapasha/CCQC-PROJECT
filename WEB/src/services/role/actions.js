import * as types from './actionTypes'
import request from 'helpers/request'

import apiPaths from 'apiPaths'
import _ from 'lodash'



export const getAllRole = () => dispatch => {
    dispatch({ type: types.GET_ALL_ROLE_REQUEST });
    request
        .get(apiPaths.role.getallrole)
        .then(({ data }) => {
            dispatch({
                type: types.GET_ALL_ROLE,
                payload: data,
            });
        }).catch(error => {
            dispatch({
                type: types.GET_ALL_ROLE_ERROR,
                error,
            })
        });
};



