import { Dispatch } from 'redux';

import { rootReducer } from './reducers';

export type RootState = ReturnType<typeof rootReducer>;
export type GetState = () => RootState;
export type TypedDispatch = Dispatch<any>;
