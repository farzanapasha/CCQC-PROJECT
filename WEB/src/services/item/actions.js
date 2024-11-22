import * as types from './actionTypes'
import request from 'helpers/request'

import apiPaths from 'apiPaths'
import _ from 'lodash'


export const getAllItem = () => dispatch => {
    dispatch({ type: types.GET_ALL_ITEM_REQUEST });
    request
        .get(apiPaths.item.getitem)
        .then(({ data }) => {
            dispatch({
                type: types.GET_ALL_ITEM,
                payload: data,
            });
        }).catch(error => {
            dispatch({
                type: types.GET_ALL_ITEM_ERROR,
                error,
            })
        });
};
