import { createSlice } from "@reduxjs/toolkit";

interface RouterState {
  value: string
}

const initialState: RouterState = {
  value: 'Message'
}

export const counterSlice = createSlice({
  name: 'activeRouter',
  initialState,
  reducers: {
    setActiveRouter: (state, data) => {
      if (state.value !== data.payload) {
        state.value = data.payload
      }
    }
  },
})

export const { setActiveRouter } = counterSlice.actions;

export default counterSlice.reducer