export interface ReducerState<T> {
    loading: boolean;
    data?: T;
    error?: string;
}
