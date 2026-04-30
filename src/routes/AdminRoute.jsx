import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth)
  const { data: profile } = useSelector((state) => state.profile)

  if (!user) return <Navigate to="/login" replace />
  if (!profile) return null
  if (profile.role !== 'admin') return <Navigate to="/dashboard" replace />

  return children
}

export default AdminRoute