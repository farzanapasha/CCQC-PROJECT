import * as types from './actionTypes';
import initialState from './initialState';

const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.GET_ALL_PAYMENT_REQUEST:
            return {
                ...state,
                isLoaded: false
            };
        case types.GET_ALL_PAYMENT:
            return {
                ...state,
                isLoaded: true,
                data: action.payload.data
            };
        case types.GET_ALL_PAYMENT_ERROR:
            return {
                ...state,
                isLoaded: false,
                error: action.data.error
            };
            case types.GET_PAYMENT_BY_CLIENT_REQUEST:
                return {
                    ...state,
                    isClientLoaded: false
                };
        case types.GET_PAYMENT_BY_CLIENT:
                return {
                    ...state,
                    isClientLoaded: true,
                    clientData: action.payload.data
                };
        case types.GET_PAYMENT_BY_CLIENT_ERROR:
                return {
                    ...state,
                    isClientLoaded: false,
                    error: action.data.error
                };
        case types.GET_PAYMENT_BY_INVOICE_REQUEST:
                    return {
                        ...state,
                        isInvoiceLoaded: false
                    };
        case types.GET_PAYMENT_BY_INVOICE:
                    return {
                        ...state,
                        isInvoiceLoaded: true,
                        invoiceData: action.payload.data
                    };
        case types.GET_PAYMENT_BY_INVOICE_ERROR:
                    return {
                        ...state,
                        isInvoiceLoaded: false,
                        error: action.data.error
                    };
        default:
            return state;
    }
};
export default Reducer;