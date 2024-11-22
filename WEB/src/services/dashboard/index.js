import * as types from './actionTypes';
import initialState from './initialState';

const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.GET_APPOINMENT_REQUEST:
            return {
                ...state,
                isLoaded: false
            };
        case types.GET_APPOINMENT:
            return {
                ...state,
                isLoaded: true,
                data: action.payload.data
            };
        case types.GET_APPOINMENT_ERROR:
            return {
                ...state,
                isLoaded: false,
                error: action.data.error
            };
        case types.GET_INSIGHTS_REQUEST:
                return {
                    ...state,
                    isLoaded: false
                };
        case types.GET_INSIGHTS:
                return {
                    ...state,
                    isLoaded: true,
                    insightsData: action.payload.data
                };
        case types.GET_INSIGHTS_ERROR:
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