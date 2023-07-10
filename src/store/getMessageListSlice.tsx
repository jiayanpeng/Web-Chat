/*
  消息列表的用户，发消息或受到消息把对方添加到消息列表
*/

import { createSlice } from "@reduxjs/toolkit";
interface UserList {
  value: number[]
}

const initialState: UserList = {
  value: []
}

export const messageListSlice = createSlice({
  name: 'messageListSlice',
  initialState,
  reducers: {
    setMessageList: (state, data) => {
      let user = state.value.find(item => {
        return item === data.payload
      })
      if (!user) {
        state.value.unshift(data.payload)
      } else {
        state.value = state.value.filter(item => item !== data.payload)
        state.value.unshift(data.payload)
      }
    },
    emptyMessageList: (state) => {
      state.value = []
    }
  }
})

export const { setMessageList, emptyMessageList } = messageListSlice.actions

export default messageListSlice.reducer