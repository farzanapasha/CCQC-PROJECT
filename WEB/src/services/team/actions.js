import * as types from './actionTypes'
import request from 'helpers/request'

import apiPaths from 'apiPaths'
import _ from 'lodash'

export const getAllTeam = () => dispatch => {
    dispatch({ type: types.GET_ALL_TEAM_REQUEST });
    request
        .get(apiPaths.team.getallteam)
        .then(({ data }) => {
            dispatch({
                type: types.GET_ALL_TEAM,
                payload: data,
            });
        }).catch(error => {
            dispatch({
                type: types.GET_ALL_TEAM_ERROR,
                error,
            })
        });
};
