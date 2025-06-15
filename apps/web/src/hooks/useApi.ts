import React from 'react';
import { promiseCatch } from '#/utils/promise-catch'
import { PaginatedResponse } from '#/services';

type State<T> = {
    data: T[];
    isFetching: boolean;
    error: string | null;
    page: number;
    totalPages: number;
};

type Action<T> =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: { data: T[]; page: number; totalPages: number } }
    | { type: 'FETCH_ERROR'; error: string }
    | { type: 'APPEND'; payload: { data: T[]; page: number } }
    | { type: 'ADD'; payload: T }
    | { type: 'REMOVE'; payload: string };

const createReducer = <T>() => (
    state: State<T>,
    action: Action<T>
): State<T> => {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, isFetching: true, error: null };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                data: action.payload.data,
                page: action.payload.page,
                totalPages: action.payload.totalPages,
                isFetching: false
            };
        case 'APPEND':
            return {
                ...state,
                data: [...state.data, ...action.payload.data],
                page: action.payload.page
            };
        case 'FETCH_ERROR':
            return { ...state, isFetching: false, error: action.error };
        case 'ADD':
            return { ...state, data: [action.payload, ...state.data] };
        case 'REMOVE':
            return { ...state, data: state.data.filter(d => (d as any).id !== action.payload) };
        default:
            return state;
    }
};

const defaultInitialState = {
    data: [],
    isFetching: false,
    error: null,
    page: 0,
    totalPages: 0
};
type UseApiProps<T> = {
    fetchFn: (page: number) => Promise<PaginatedResponse<T>>;
    deleteFn?: (id: string) => Promise<void>;
    shouldFetch?: boolean;
    updateFn?: (item: string, data: Partial<T>) => Promise<T | Partial<T>>;
}
export function useApi<T>(
    { fetchFn, deleteFn, shouldFetch = true }: UseApiProps<T>
) {
    const [state, dispatch] = React.useReducer(createReducer<T>(), defaultInitialState);
    const ignore = React.useRef(false);

    const fetchData = React.useCallback(async (page = 1) => {
        dispatch({ type: 'FETCH_START' });

        const result = await promiseCatch(fetchFn(page));

        if (ignore.current) return;

        if (result?.type === 'error') {
            dispatch({ type: 'FETCH_ERROR', error: result.message });
        } else if (result?.type === 'success') {
            const { type, ...payload } = result;
            dispatch({ type: 'FETCH_SUCCESS', payload });
        }
    }, [fetchFn]);

    React.useEffect(() => {
        ignore.current = false;
        if (shouldFetch) fetchData(1);
        return () => {
            ignore.current = true;
        };
    }, [shouldFetch, fetchData]);

    const fetchMore = React.useCallback(async () => {
        if (state.page >= state.totalPages) return;

        const nextPage = state.page + 1;
        const result = await promiseCatch(fetchFn(nextPage));

        if (ignore.current) return;

        if (result?.type === 'error') {
            dispatch({ type: 'FETCH_ERROR', error: result.message });
        } else if (result?.type === 'success') {
            const { type, ...payload } = result;
            dispatch({ type: 'APPEND', payload });
        }
    }, [fetchFn, state.page, state.totalPages]);

    const add = React.useCallback((item: T) => {
        dispatch({ type: 'ADD', payload: item });
    }, []);

    const remove = React.useCallback(async (id: string) => {
        dispatch({ type: 'REMOVE', payload: id });
        if (deleteFn) {
            const result = await promiseCatch(deleteFn(id));
            // handle errors if needed
            if (result?.type === 'error') {
                dispatch({ type: 'FETCH_ERROR', error: result.message });
                return;
            }
        }
    }, []);

    return {
        ...state,
        refetch: () => fetchData(1),
        fetchMore,
        add,
        remove
    };
}
