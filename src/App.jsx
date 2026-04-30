import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { supabase } from './lib/supabaseClient'
import { setUser, clearUser } from './features/auth/authSlice'
import AppRouter from './routes/AppRouter'

function App() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        dispatch(setUser({ user: session.user, session }))
      } else {
        dispatch(clearUser())
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          dispatch(setUser({ user: session.user, session }))
        } else {
          dispatch(clearUser())
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [dispatch])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return <AppRouter />
}

export default App