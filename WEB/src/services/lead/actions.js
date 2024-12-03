import * as types from './actionTypes'
import request from 'helpers/request'

import apiPaths from 'apiPaths'
import _ from 'lodash'

export const getAllLead = () => dispatch => {
    dispatch({ type: types.GET_ALL_LEAD_REQUEST });
    request
        .get(apiPaths.lead.getalllead)
        .then(({ data }) => {
            dispatch({
                type: types.GET_ALL_LEAD,
                payload: data,
            });
        }).catch(error => {
            dispatch({
                type: types.GET_ALL_LEAD_ERROR,
                error,
            })
        });
};




