import { configureStore } from "@reduxjs/toolkit";
import activeRouterReducer from './activeRouterSlice'
import getNoticeReducer from "./getNoticeSlice";
import toUserReducer from "./toUserSlice";
import getOnlinUserReducer from "./getOnlinUserSlice";
import getMessageDataReducer from "./getMessageDataSlice";
import getMessageListReducer from "./getMessageListSlice";
import toGroupReducer from "./toGroupSlice";

export default configureStore({
  reducer: {
    activeRouter: activeRouterReducer,
    getNotice: getNoticeReducer,
    toUser: toUserReducer,
    getOnlineUser: getOnlinUserReducer,
    getMessageData: getMessageDataReducer,
    getMessageList: getMessageListReducer,
    toGroup: toGroupReducer
  }
})
