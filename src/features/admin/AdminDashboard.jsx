import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchAllUsers } from '../auth/profileSlice'
import { fetchTasks } from '../tasks/tasksSlice'
import { updateProfile } from '../../api/profiles'

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const { allUsers } = useSelector((state) => state.profile)
  const { items: tasks } = useSelector((state) => state.tasks)

  useEffect(() => {
    dispatch(fetchAllUsers())
    dispatch(fetchTasks())
  }, [dispatch])

  const handleRoleChange = async (userId, newRole) => {
    await updateProfile(userId, { role: newRole })
    dispatch(fetchAllUsers())
  }

  const getTaskCount = (userId) => {
    return tasks.filter(t => t.assigned_to === userId || t.created_by === userId).length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-600">Task Manager — Admin</h1>
        <Link
          to="/dashboard"
          className="text-sm text-gray-600 hover:text-blue-600 transition"
        >
          ← Back to Dashboard
        </Link>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <p className="text-3xl font-bold text-gray-800">{allUsers.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total Users</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{tasks.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total Tasks</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <p className="text-3xl font-bold text-green-600">
              {tasks.filter(t => t.status === 'done').length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Completed Tasks</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-800 text-lg">All Users</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Tasks</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Change Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                        {(user.full_name || user.email)[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {user.full_name || 'No name'}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      user.role === 'admin' ? 'bg-red-100 text-red-700' :
                      user.role === 'manager' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{getTaskCount(user.id)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="user">User</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* All Tasks */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-800 text-lg">All Tasks</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Task</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Assigned To</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tasks.map(task => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-800">{task.title}</p>
                    {task.description && (
                      <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      task.status === 'done' ? 'bg-green-100 text-green-700' :
                      task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      task.priority === 'high' ? 'bg-red-100 text-red-700' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">
                      {task.assigned_to?.full_name || task.assigned_to?.email || 'Unassigned'}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  )
}

export default AdminDashboard