import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function Notes() {
  const { user } = useAuth()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    isFavorite: false
  })

  useEffect(() => {
    if (user) {
      fetchNotes()
    }
  }, [user, searchTerm, selectedTags])

  const fetchNotes = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('q', searchTerm)
      if (selectedTags) params.append('tags', selectedTags)
      
      const response = await axios.get(`${API_URL}/notes?${params}`)
      setNotes(response.data.notes)
    } catch (error) {
      toast.error('Failed to fetch notes')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const noteData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      }

      if (editingNote) {
        await axios.put(`${API_URL}/notes/${editingNote._id}`, noteData)
        toast.success('Note updated successfully')
      } else {
        await axios.post(`${API_URL}/notes`, noteData)
        toast.success('Note created successfully')
      }

      setShowModal(false)
      setEditingNote(null)
      setFormData({ title: '', content: '', tags: '', isFavorite: false })
      fetchNotes()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save note')
    }
  }

  const handleEdit = (note) => {
    setEditingNote(note)
    setFormData({
      title: note.title,
      content: note.content,
      tags: note.tags.join(', '),
      isFavorite: note.isFavorite
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await axios.delete(`${API_URL}/notes/${id}`)
        toast.success('Note deleted successfully')
        fetchNotes()
      } catch (error) {
        toast.error('Failed to delete note')
      }
    }
  }

  const toggleFavorite = async (note) => {
    try {
      await axios.put(`${API_URL}/notes/${note._id}`, {
        isFavorite: !note.isFavorite
      })
      fetchNotes()
    } catch (error) {
      toast.error('Failed to update favorite status')
    }
  }

  if (!user) return null

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Notes</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          Add Note
        </button>
      </div>

      {/* Search and Filter */}
      <div className="card p-4 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search notes..."
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

      {/* Notes List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No notes found. Create your first note!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {notes.map((note) => (
            <div key={note._id} className="card p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{note.title}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleFavorite(note)}
                    className={`text-yellow-500 hover:text-yellow-600 ${
                      note.isFavorite ? '' : 'opacity-50'
                    }`}
                  >
                    ★
                  </button>
                  <button
                    onClick={() => handleEdit(note)}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-3 whitespace-pre-wrap">{note.content}</p>
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">
                {new Date(note.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingNote ? 'Edit Note' : 'Add Note'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    required
                    rows="4"
                    className="textarea"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
                    setEditingNote(null)
                    setFormData({ title: '', content: '', tags: '', isFavorite: false })
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingNote ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
