import { createSlice } from "@reduxjs/toolkit";

interface UserData {
  id: number,
  username: string,
  password: string,
  name: string,
  headImg: string
}

interface Notice {
  value: UserData[]
}

const initialState: Notice = {
  value: []
}

export const noticeSlice = createSlice({
  name: 'activeRouter',
  initialState,
  reducers: {
    setNotice: (state, data) => {
      state.value = data.payload
      // console.log(state.value)
    },
    delNotice: (state, data) => {
      state.value = state.value.filter(item => {
        return item.id !== data.payload.id
      })
      console.log(state.value)
    }
  },
})
export const { setNotice, delNotice } = noticeSlice.actions;

export default noticeSlice.reducer