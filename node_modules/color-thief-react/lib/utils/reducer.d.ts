import { ReducerState, ReducerAction } from '../types';
export default function reducer<State extends ReducerState<any>>(state: State, action: ReducerAction): State;
