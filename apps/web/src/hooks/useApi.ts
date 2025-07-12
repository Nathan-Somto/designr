import { ApiSuccessResponse } from "#/services";
import { promiseCatch } from "#/utils/promise-catch";
import React from "react";

type SingleState<T> = {
    data: T | null;
    isFetching: boolean;
    error: string | null;
};

type SingleAction<T> =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: T }
    | { type: 'FETCH_ERROR'; error: string }
    | { type: 'SET'; payload: T }
    | { type: 'CLEAR' };

const singleReducer = <T>() => (
    state: SingleState<T>,
    action: SingleAction<T>
): SingleState<T> => {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, isFetching: true, error: null };
        case 'FETCH_SUCCESS':
        case 'SET':
            return { ...state, data: action.payload, isFetching: false };
        case 'FETCH_ERROR':
            return { ...state, isFetching: false, error: action.error };
        case 'CLEAR':
            return { ...state, data: null };
        default:
            return state;
    }
};

type SingleApiProps<T> = {
    fetchFn: () => Promise<ApiSuccessResponse<{ data: T }>>;
    shouldFetch?: boolean;
};

export function useApi<T>({
    fetchFn,
    shouldFetch = true
}: SingleApiProps<T>) {
    const [state, dispatch] = React.useReducer(singleReducer<T>(), {
        data: null,
        isFetching: false,
        error: null
    });
    const ignore = React.useRef(false);

    const fetchData = React.useCallback(async () => {
        dispatch({ type: 'FETCH_START' });
        const result = await promiseCatch(fetchFn());
        if (ignore.current) return;
        if (result?.type === 'error') {
            dispatch({ type: 'FETCH_ERROR', error: result.message });
        } else {
            // if it undefined dispatch fetch error
            if (!result || !result.data) {
                dispatch({ type: 'FETCH_ERROR', error: 'No data returned' });
                return;
            }
            dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        }
    }, [fetchFn]);

    React.useEffect(() => {
        ignore.current = false;
        if (shouldFetch) fetchData();
        return () => { ignore.current = true; };
    }, [shouldFetch, fetchData]);

    const set = React.useCallback((data: T) => {
        dispatch({ type: 'SET', payload: data });
    }, []);

    const clear = React.useCallback(() => {
        dispatch({ type: 'CLEAR' });
    }, []);

    return {
        ...state,
        refetch: fetchData,
        set,
        clear
    };
}
