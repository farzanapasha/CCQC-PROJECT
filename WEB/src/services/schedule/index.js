import * as types from './actionTypes';
import initialState from './initialState';

const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.GET_ALL_SCHEDULE_REQUEST:
            return {
                ...state,
                isLoaded: false
            };
        case types.GET_ALL_SCHEDULE:
            return {
                ...state,
                isLoaded: true,
                data: action.payload.data
            };
        case types.GET_ALL_SCHEDULE_ERROR:
            return {
                ...state,
                isLoaded: false,
                error: action.data.error
            };
        case types.GET_ALL_SCHEDULE_BY_WORKORDER_REQUEST:
                return {
                    ...state,
                    isWorkLoaded: false
                };
        case types.GET_ALL_SCHEDULE_BY_WORKORDER:
                return {
                    ...state,
                    isWorkLoaded: true,
                    workData: action.payload.data
                };
        case types.GET_ALL_SCHEDULE_BY_WORKORDER_ERROR:
                return {
                    ...state,
                    isWorkLoaded: false,
                    error: action.data.error
                };
        default:
            return state;
    }
};
export default Reducer;