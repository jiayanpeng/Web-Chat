import { configureStore } from "@reduxjs/toolkit";
import activeRouterReducer from './activeRouterSlice'

export default configureStore({
  reducer: {
    activeRouter: activeRouterReducer
  }
})
