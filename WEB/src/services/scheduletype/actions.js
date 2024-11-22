import * as types from './actionTypes'
import request from 'helpers/request'

import apiPaths from 'apiPaths'
import _ from 'lodash'


export const getAllScheduleType = () => dispatch => {
    dispatch({ type: types.GET_ALL_SCHEDULE_TYPE_REQUEST });
    request
        .get(apiPaths.scheduletype.getworktypes)
        .then(({ data }) => {
            dispatch({
                type: types.GET_ALL_SCHEDULE_TYPE,
                payload: data,
            });
        }).catch(error => {
            dispatch({
                type: types.GET_ALL_SCHEDULE_TYPE_ERROR,
                error,
            })
        });
};

