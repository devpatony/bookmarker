import { useAuth } from '../context/AuthContext'
import Link from 'next/link'

export default function Home() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="text-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Bookmarker
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your personal notes and bookmark manager
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/notes" className="card p-6 hover:shadow-lg transition-shadow">
            <div className="text-primary-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Notes</h2>
            <p className="text-gray-600">Create and organize your personal notes with tags</p>
          </Link>
          
          <Link href="/bookmarks" className="card p-6 hover:shadow-lg transition-shadow">
            <div className="text-primary-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Bookmarks</h2>
            <p className="text-gray-600">Save and organize your favorite websites</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
