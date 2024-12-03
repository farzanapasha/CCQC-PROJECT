import _assign from 'lodash/assign';

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');

        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (e) {
        return undefined;
    }
};

export const promiseLoadState = () => {
    try {
        const serializedState = localStorage.getItem('state');

        if (serializedState === null) {
            return undefined;
        }
        return Promise.resolve().then(() => {
            return JSON.parse(serializedState);
        });
    } catch (e) {
        return Promise.resolve().then(() => {
            return undefined;
        });
    }
};

export const saveState = state => {
    try {
        localStorage.setItem('state', JSON.stringify(state));
    } catch (e) {
        // TODO: Log errors
    }
};

export const updateState = state => {
    try {
        let existingState = loadState();
        if (existingState) {
            _assign(existingState.session, state);
        } else {
            existingState = {
                session: state,
            };
        }

        saveState(existingState);
    } catch (e) {
        // TODO: Log errors
    }
};

export const clearState = () => {
    try {
        localStorage.removeItem('state');
    } catch (e) {
        // TODO: Log errors
    }
};