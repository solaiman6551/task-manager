import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getTasks, createTask, updateTask, deleteTask } from '../../api/tasks'

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async () => {
  return await getTasks()
})

export const addTask = createAsyncThunk('tasks/add', async (task) => {
  return await createTask(task)
})

export const editTask = createAsyncThunk('tasks/edit', async ({ id, updates }) => {
  return await updateTask(id, updates)
})

export const removeTask = createAsyncThunk('tasks/remove', async (id) => {
  await deleteTask(id)
  return id
})

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.loading = true })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(editTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(t => t.id === action.payload.id)
        if (index !== -1) state.items[index] = action.payload
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.id !== action.payload)
      })
  },
})

export default tasksSlice.reducer