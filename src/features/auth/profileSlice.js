import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getProfile, updateProfile } from '../../api/profiles'

export const fetchProfile = createAsyncThunk('profile/fetch', async (userId) => {
  return await getProfile(userId)
})

export const saveProfile = createAsyncThunk('profile/save', async ({ userId, updates }) => {
  return await updateProfile(userId, updates)
})

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null,
    loading: false,
    error: null,
    saveSuccess: false,
  },
  reducers: {
    resetSaveSuccess: (state) => {
      state.saveSuccess = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => { state.loading = true })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.data = action.payload
        state.saveSuccess = true
      })
  },
})

export const { resetSaveSuccess } = profileSlice.actions
export default profileSlice.reducer