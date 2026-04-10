import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  // Check if user is logged in (you can change this logic)
  const isAuthenticated = localStorage.getItem('token')

  // If not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  // If logged in → allow access
  return children
}

export default ProtectedRoute