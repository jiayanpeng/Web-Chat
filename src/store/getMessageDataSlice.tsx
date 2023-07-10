/*
  所有跟自己有关的消息
*/

import { createSlice } from "@reduxjs/toolkit";

interface MsgValue {
  msg: string,
  type: number,
  userId: number,
  friendId: number
}

interface MsgList {
  value: MsgValue[]
}

const initialState: MsgList = {
  value: []
}

export const messageDataSlice = createSlice({
  name: 'messageDataSlice',
  initialState,
  reducers: {
    setMessageData: (state, data) => {
      state.value.push(data.payload)
    }
  }
})

export const { setMessageData } = messageDataSlice.actions

export default messageDataSlice.reducer