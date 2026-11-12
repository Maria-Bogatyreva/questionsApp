import {configureStore} from "@reduxjs/toolkit";
import {apiSlice} from "../services/questionsApi.ts";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer // вот подключение данных из RTК Query к общему к store!!
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware)
})

export default store;