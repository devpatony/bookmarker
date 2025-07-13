import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function Bookmarks() {
  const { user } = useAuth()
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    tags: '',
    isFavorite: false
  })

  useEffect(() => {
    if (user) {
      fetchBookmarks()
    }
  }, [user, searchTerm, selectedTags])

  const fetchBookmarks = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('q', searchTerm)
      if (selectedTags) params.append('tags', selectedTags)
      
      const response = await axios.get(`${API_URL}/bookmarks?${params}`)
      setBookmarks(response.data.bookmarks)
    } catch (error) {
      toast.error('Failed to fetch bookmarks')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const bookmarkData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      }

      if (editingBookmark) {
        await axios.put(`${API_URL}/bookmarks/${editingBookmark._id}`, bookmarkData)
        toast.success('Bookmark updated successfully')
      } else {
        await axios.post(`${API_URL}/bookmarks`, bookmarkData)
        toast.success('Bookmark created successfully')
      }

      setShowModal(false)
      setEditingBookmark(null)
      setFormData({ title: '', url: '', description: '', tags: '', isFavorite: false })
      fetchBookmarks()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save bookmark')
    }
  }

  const handleEdit = (bookmark) => {
    setEditingBookmark(bookmark)
    setFormData({
      title: bookmark.title,
      url: bookmark.url,
      description: bookmark.description || '',
      tags: bookmark.tags.join(', '),
      isFavorite: bookmark.isFavorite
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this bookmark?')) {
      try {
        await axios.delete(`${API_URL}/bookmarks/${id}`)
        toast.success('Bookmark deleted successfully')
        fetchBookmarks()
      } catch (error) {
        toast.error('Failed to delete bookmark')
      }
    }
  }

  const toggleFavorite = async (bookmark) => {
    try {
      await axios.put(`${API_URL}/bookmarks/${bookmark._id}`, {
        isFavorite: !bookmark.isFavorite
      })
      fetchBookmarks()
    } catch (error) {
      toast.error('Failed to update favorite status')
    }
  }

  if (!user) return null

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Bookmarks</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          Add Bookmark
        </button>
      </div>

      <div className="card p-4 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search bookmarks..."
              className="input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by tags
            </label>
            <input
              type="text"
              placeholder="tag1, tag2"
              className="input"
              value={selectedTags}
              onChange={(e) => setSelectedTags(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No bookmarks found. Create your first bookmark!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookmarks.map((bookmark) => (
            <div key={bookmark._id} className="card p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{bookmark.title}</h3>
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 text-sm break-all"
                  >
                    {bookmark.url}
                  </a>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => toggleFavorite(bookmark)}
                    className={`text-yellow-500 hover:text-yellow-600 ${
                      bookmark.isFavorite ? '' : 'opacity-50'
                    }`}
                  >
                    ★
                  </button>
                  <button
                    onClick={() => handleEdit(bookmark)}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(bookmark._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {bookmark.description && (
                <p className="text-gray-600 mb-3">{bookmark.description}</p>
              )}
              {bookmark.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {bookmark.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-400">
                {new Date(bookmark.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingBookmark ? 'Edit Bookmark' : 'Add Bookmark'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL
                  </label>
                  <input
                    type="url"
                    required
                    className="input"
                    placeholder="https://example.com"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title (leave empty to auto-fetch)
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    className="textarea"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="tag1, tag2, tag3"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFavorite"
                    className="mr-2"
                    checked={formData.isFavorite}
                    onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
                  />
                  <label htmlFor="isFavorite" className="text-sm text-gray-700">
                    Mark as favorite
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingBookmark(null)
                    setFormData({ title: '', url: '', description: '', tags: '', isFavorite: false })
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingBookmark ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
