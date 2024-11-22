import * as types from './actionTypes';
import initialState from './initialState';

const LoginReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.GET_LOGIN:
            return {
                ...state,
                user: action.payload
            };
        case types.GET_LOGIN_ERROR:
            return {
                ...state,
                errormessage: action.payload.data.error.message
            };
        default:
            return state;
    }

};

export default LoginReducer;