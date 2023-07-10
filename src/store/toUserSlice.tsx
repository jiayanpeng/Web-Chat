import { createSlice } from "@reduxjs/toolkit";

interface userInfo {
  id: number,
  name: string,
  type: number
}

const initialState: userInfo = {
  id: 0,
  name: '',
  type: 0
}

export const userSlice = createSlice({
  name: 'toUserSlice',
  initialState,
  reducers: {
    setUserInfo: (state, data) => {
      state.id = data.payload.id
      state.name = data.payload.name
      state.type = data.payload.type
    }
  }
})

export const { setUserInfo } = userSlice.actions

export default userSlice.reducer