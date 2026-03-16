import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, LayoutDashboard, Inbox } from 'lucide-react'
import toast from 'react-hot-toast'
import PaperCard from '../components/PaperCard'
import FilterBar from '../components/FilterBar'
import { useAuth } from '../context/AuthContext'
import {
  deleteMyPaper,
  deletePaperAsAdmin,
  getAdminPapers,
  getMyUploads,
} from '../services/api'

export default function DashboardPage() {
  const { user, isAdmin } = useAuth()
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState('')
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ courseName: '', courseCode: '', slot: '', examType: '' })

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      setError('')

      try {
        const { data } = isAdmin ? await getAdminPapers() : await getMyUploads()
        setPapers(data.data || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load your dashboard right now.')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [isAdmin])

  const filteredPapers = useMemo(() => {
    const courseName = filters.courseName.trim().toLowerCase()
    const courseCode = filters.courseCode.trim().toLowerCase()
    const slot = filters.slot.trim()
    const examType = filters.examType.trim()

    return papers.filter((paper) => {
      const paperCourseName = (paper.courseName || '').toLowerCase()
      const paperCourseCode = (paper.courseCode || '').toLowerCase()
      const paperSlot = paper.slot || ''
      const paperExamType = paper.examType || ''

      if (courseName && !paperCourseName.includes(courseName)) return false
      if (courseCode && !paperCourseCode.includes(courseCode)) return false
      if (slot && paperSlot !== slot) return false
      if (examType && paperExamType !== examType) return false
      return true
    })
  }, [papers, filters.courseName, filters.courseCode, filters.slot, filters.examType])

  const handleDelete = async (paperId) => {
    const confirmDelete = window.confirm(
      isAdmin
        ? 'Delete this uploaded file for all users?'
        : 'Delete this file from your uploads?'
    )

    if (!confirmDelete) {
      return
    }

    setDeletingId(paperId)

    try {
      if (isAdmin) {
        await deletePaperAsAdmin(paperId)
      } else {
        await deleteMyPaper(paperId)
      }

      setPapers((current) => current.filter((paper) => paper._id !== paperId))
      toast.success('File deleted successfully.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete the file.')
    } finally {
      setDeletingId('')
    }
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/10 px-4 py-1.5 text-sm font-medium text-primary-300 mb-4">
            {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
          </div>
          <h1 className="section-title mb-3">
            {isAdmin ? 'Manage all uploaded files' : 'Manage your uploaded files'}
          </h1>
          <p className="section-subtitle text-base max-w-2xl">
            {isAdmin
              ? 'Review every uploaded paper across ExamVault and remove any file regardless of owner.'
              : 'See the files you have uploaded, track contribution dates, and delete your own uploads when needed.'}
          </p>
        </div>

        <div className="card px-5 py-4 flex items-center gap-4 max-w-md">
          <img
            src={user?.profilePicture}
            alt={user?.name}
            className="w-14 h-14 rounded-2xl object-cover border border-gray-700"
          />
          <div className="min-w-0">
            <p className="text-white font-semibold truncate">{user?.name}</p>
            <p className="text-sm text-gray-400 truncate">{user?.email}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-primary-300 mt-1">{user?.role}</p>
          </div>
        </div>
      </div>

      <FilterBar filters={filters} onChange={setFilters} showSlot />

      {!loading && !error && (
        <p className="text-sm text-gray-500 mb-4">
          {filteredPapers.length === 0
            ? 'No uploaded files found.'
            : `${filteredPapers.length} uploaded file${filteredPapers.length > 1 ? 's' : ''}`}
        </p>
      )}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="card p-5 space-y-3 animate-pulse">
              <div className="h-5 bg-gray-800 rounded w-2/3" />
              <div className="h-4 bg-gray-800 rounded w-1/2" />
              <div className="h-4 bg-gray-800 rounded w-1/3" />
              <div className="h-px bg-gray-800" />
              <div className="h-10 bg-gray-800 rounded-xl" />
              <div className="h-10 bg-gray-800 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="card p-8 text-center">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-red-400 font-medium mb-4">{error}</p>
        </div>
      )}

      {!loading && !error && filteredPapers.length === 0 && (
        <div className="card p-10 text-center flex flex-col items-center">
          {isAdmin ? <LayoutDashboard className="w-12 h-12 text-primary-400 mb-4" /> : <Inbox className="w-12 h-12 text-primary-400 mb-4" />}
          <h2 className="text-xl font-semibold text-white mb-2">
            {isAdmin ? 'No uploads in the vault yet' : 'You have not uploaded anything yet'}
          </h2>
          <p className="text-sm text-gray-400">
            {Object.values(filters).some(Boolean)
              ? 'No papers match your current filters. Try adjusting or clearing them.'
              : isAdmin
                ? 'Once users upload files, they will appear here for moderation.'
                : 'Upload your first exam paper to start building your dashboard.'}
          </p>
        </div>
      )}

      {!loading && !error && filteredPapers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredPapers.map((paper) => (
            <PaperCard
              key={paper._id}
              paper={paper}
              showUploader={isAdmin}
              canDelete
              deleting={deletingId === paper._id}
              onDelete={() => handleDelete(paper._id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
