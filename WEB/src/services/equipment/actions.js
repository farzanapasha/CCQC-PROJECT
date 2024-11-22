import * as types from './actionTypes'
import request from 'helpers/request'

import apiPaths from 'apiPaths'
import _ from 'lodash'


export const getAllEquipment = () => dispatch => {
    dispatch({ type: types.GET_ALL_EQUIPMENT_REQUEST });
    request
        .get(apiPaths.equipment.getequipments)
        .then(({ data }) => {
            dispatch({
                type: types.GET_ALL_EQUIPMENT,
                payload: data,
            });
        }).catch(error => {
            dispatch({
                type: types.GET_ALL_EQUIPMENT_ERROR,
                error,
            })
        });
};
