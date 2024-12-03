import * as types from './actionTypes';
import initialState from './initialState';

const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.GET_ALL_EQUIPMENT_REQUEST:
            return {
                ...state,
                isLoaded: false
            };
        case types.GET_ALL_EQUIPMENT:
            return {
                ...state,
                isLoaded: true,
                data: action.payload.data
            };
        case types.GET_ALL_EQUIPMENT_ERROR:
            return {
                ...state,
                isLoaded: false,
                error: action.data.error
            };
        default:
            return state;
    }
};
export default Reducer;