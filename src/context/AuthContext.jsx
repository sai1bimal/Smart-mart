import { createContext, useState, useEffect } from 'react'

// Mock credentials — this project has no backend, so login is simulated.
const MOCK_USER = { name: 'Sohan', email: 'user@gmail.com', password: '123456' }

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Lazy initial state: read any previously logged-in user straight
  // from LocalStorage so a page refresh doesn't log the user out.
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('shopkart_user')
    return saved ? JSON.parse(saved) : null
  })

  // Keep LocalStorage in sync whenever `user` changes.
  useEffect(() => {
    if (user) {
      localStorage.setItem('shopkart_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('shopkart_user')
    }
  }, [user])

  // login() checks the mock credentials and returns a result object
  // instead of throwing, so the Login page can show a friendly message.
  const login = (email, password) => {
    if (email.trim().toLowerCase() === MOCK_USER.email && password === MOCK_USER.password) {
      setUser({ name: MOCK_USER.name, email: MOCK_USER.email })
      return { success: true }
    }
    return { success: false, message: 'Invalid email or password' }
  }

  const logout = () => setUser(null)

  const isAuthenticated = Boolean(user)

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}
