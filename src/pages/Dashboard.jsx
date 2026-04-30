import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { clearUser } from '../features/auth/authSlice'
import TaskList from '../features/tasks/TaskList'

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    dispatch(clearUser())
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-600">Task Manager</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700 transition"
          >
            Logout
          </button>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <TaskList />
      </main>
    </div>
  )
}

export default Dashboard