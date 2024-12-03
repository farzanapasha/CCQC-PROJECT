import * as types from './actionTypes'
import request from 'helpers/request'

import apiPaths from 'apiPaths'
import _ from 'lodash'


export const getAllSchedule = () => dispatch => {
    dispatch({ type: types.GET_ALL_SCHEDULE_REQUEST });
    request
        .get(apiPaths.schedule.getallschedule)
        .then(({ data }) => {
            dispatch({
                type: types.GET_ALL_SCHEDULE,
                payload: data,
            });
        }).catch(error => {
            dispatch({
                type: types.GET_ALL_SCHEDULE_ERROR,
                error,
            })
        });
};


export const getAllScheduleByWorkOrder = (params) => dispatch => {
    dispatch({ type: types.GET_ALL_SCHEDULE_BY_WORKORDER_REQUEST });
    request
        .get(apiPaths.schedule.getschedulebyworkorder,params)
        .then(({ data }) => {
            dispatch({
                type: types.GET_ALL_SCHEDULE_BY_WORKORDER,
                payload: data,
            });
        }).catch(error => {
            dispatch({
                type: types.GET_ALL_SCHEDULE_BY_WORKORDER_ERROR,
                error,
            })
        });
};







