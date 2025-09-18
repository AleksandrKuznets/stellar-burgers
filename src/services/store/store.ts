import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { ingredientsSlise } from '@slices/ingredients/ingredients';
import { createOrderSlice } from '@slices/newOrder/newOrder';
import { userSlice } from '@slices/user/user';
import { userOrdersSlice } from '@slices/userOrders/userOrders';
import { feedsSlice } from '@slices/feeds/feeds';
import { constructorSlice } from '@slices/constructor/constructor';

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
