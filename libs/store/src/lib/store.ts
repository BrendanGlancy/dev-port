import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { blogReducer } from './blog';
import { layoutReducer } from './layout';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['layout', 'blog'],
};

const reducer = combineReducers({
  layout: layoutReducer,
  blog: blogReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  // .prepend(routerMiddleware),
  //   .concat(usersApi.middleware),
  devTools: true,
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
// top-level state
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;
