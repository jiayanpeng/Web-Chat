import { createSlice } from "@reduxjs/toolkit";

interface UserData {
  id: number,
  username: string,
  password: string,
  name: string,
  headImg: string
}
interface UserList {
  value: UserData[]
}

const initialState: UserList = {
  value: []
}

export const onlineUserSlice = createSlice({
  name: 'getOnlinUser',
  initialState,
  reducers: {
    setOnlineUsers: (state, data) => {
      state.value = data.payload
    }
  }
})

export const { setOnlineUsers } = onlineUserSlice.actions

export default onlineUserSlice.reducer