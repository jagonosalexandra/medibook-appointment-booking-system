import React from 'react'
import { isLoggedIn } from '../services/authService'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn()) {
        return <Navigate to='/login' replace />
    }
  return children
}

export default ProtectedRoute