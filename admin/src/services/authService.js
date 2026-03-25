import api from './api'

export const adminLogin = async (username, password) => {
  try {
    const response = await api.post('/api/auth/login', { username, password })
    
    localStorage.setItem('adminToken', response.data.token)
    localStorage.setItem('adminInfo', JSON.stringify(response.data.admin))
    
    return response.data

  } catch (error) {
    const message = error.response?.data?.message || 'Login failed'
    throw new Error(message)
  }
}

export const adminLogout = () => {
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminInfo')
}

export const getToken = () => localStorage.getItem('adminToken')

export const isLoggedIn = () => !!getToken()