import { useAuth } from '../context/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Layout = ({ children }) => {
  const { user, logout, loading } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user && !['/login', '/register'].includes(router.pathname)) {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user && (
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link href="/" className="flex items-center">
                  <span className="text-xl font-bold text-primary-600">Bookmarker</span>
                </Link>
                <div className="hidden md:flex space-x-4">
                  <Link 
                    href="/notes" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      router.pathname === '/notes' 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Notes
                  </Link>
                  <Link 
                    href="/bookmarks" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      router.pathname === '/bookmarks' 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Bookmarks
                  </Link>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user.username}</span>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

export default Layout
