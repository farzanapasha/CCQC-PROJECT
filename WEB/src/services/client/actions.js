import * as types from './actionTypes'
import request from 'helpers/request'

import apiPaths from 'apiPaths'
import _ from 'lodash'



export const getAllClient = () => dispatch => {
    dispatch({ type: types.GET_ALL_CLIENT_REQUEST });
    request
        .get(apiPaths.client.getallclient)
        .then(({ data }) => {
            dispatch({
                type: types.GET_ALL_CLIENT,
                payload: data,
            });
        }).catch(error => {
            dispatch({
                type: types.GET_ALL_CLIENT_ERROR,
                error,
            })
        });
};