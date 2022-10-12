export interface ReducerAction {
    type: 'start' | 'resolve' | 'reject';
    payload: any;
}
