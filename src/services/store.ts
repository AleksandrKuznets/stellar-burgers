import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { constructorSlice } from '@slices/constructor';
import { feedsSlice } from '@slices/feeds';
import { ingredientsSlise } from '@slices/ingredients';
import { createOrderSlice } from '@slices/newOrder';
import { userSlice } from '@slices/user';
import { userOrdersSlice } from '@slices/userOrders';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineSlices(
  ingredientsSlise,
  feedsSlice,
  constructorSlice,
  userSlice,
  userOrdersSlice,
  createOrderSlice
);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
