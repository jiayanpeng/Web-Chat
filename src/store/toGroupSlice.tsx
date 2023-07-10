import { createSlice } from "@reduxjs/toolkit";

interface UserData {
  id: number,
  username: string,
  password: string,
  name: string,
  headImg: string
}

interface Groups {
  id: number,
  name: string,
  member: UserData[]
}

const initialState: Groups = {
  id: 0,
  name: '',
  member: []
}

export const groupSlice = createSlice({
  name: 'groupSlice',
  initialState,
  reducers: {
    setGroupInfo: (state, data) => {
      state.id = data.payload.id
      state.name = data.payload.name
      state.member = data.payload.member
    }
  }
})

export const { setGroupInfo } = groupSlice.actions

export default groupSlice.reducer