import { configureStore } from '@reduxjs/toolkit';
import optionsReducer from './options-slice';

export const store = configureStore({
  reducer: {
    options: optionsReducer,
  }
});

export default store;
