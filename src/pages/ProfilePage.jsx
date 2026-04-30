import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchProfile, saveProfile, resetSaveSuccess } from '../features/auth/profileSlice'
import { fetchTasks } from '../features/tasks/tasksSlice'

const ProfilePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { data: profile, loading, saveSuccess } = useSelector((state) => state.profile)
  const { items: tasks = [] } = useSelector((state) => state.tasks)
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    if (user) {
      dispatch(fetchProfile(user.id))
      dispatch(fetchTasks())
    }
  }, [user, dispatch])

  useEffect(() => {
    if (profile) setFullName(profile.full_name || '')
  }, [profile])

  useEffect(() => {
    if (saveSuccess) {
      setTimeout(() => dispatch(resetSaveSuccess()), 3000)
    }
  }, [saveSuccess, dispatch])

  const handleSave = (e) => {
    e.preventDefault()
    dispatch(saveProfile({ userId: user.id, updates: { full_name: fullName } }))
  }

  const myTasks = tasks.filter(t => t.created_by === user?.id)
  const completedTasks = myTasks.filter(t => t.status === 'done')
  const inProgressTasks = myTasks.filter(t => t.status === 'in_progress')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-600">Task Manager</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm text-gray-600 hover:text-blue-600 transition"
        >
          ← Back to Dashboard
        </button>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {profile?.full_name || 'No name set'}
              </h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full mt-1 inline-block">
                {profile?.role || 'user'}
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
              />
            </div>
            {saveSuccess && (
              <p className="text-green-600 text-sm">Profile updated successfully!</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-800 mb-4">My Task Stats</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-3xl font-bold text-gray-800">{myTasks.length}</p>
              <p className="text-sm text-gray-500 mt-1">Total Tasks</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <p className="text-3xl font-bold text-green-600">{completedTasks.length}</p>
              <p className="text-sm text-gray-500 mt-1">Completed</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-3xl font-bold text-blue-600">{inProgressTasks.length}</p>
              <p className="text-sm text-gray-500 mt-1">In Progress</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProfilePage