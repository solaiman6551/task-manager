import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  session: null,
  loading: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user
      state.session = action.payload.session
    },
    clearUser: (state) => {
      state.user = null
      state.session = null
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
  },
})

export const { setUser, clearUser, setLoading } = authSlice.actions
export default authSlice.reducer