import { useState, useEffect, useCallback } from 'react'
import { BookOpen, AlertTriangle, Inbox } from 'lucide-react'
import { getPYQs } from '../services/api'
import PaperCard from '../components/PaperCard'
import FilterBar from '../components/FilterBar'

export default function PYQsPage() {
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({ courseName: '', courseCode: '', examType: '' })

  const fetchPapers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '')
      )
      const { data } = await getPYQs(activeFilters)
      setPapers(data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load PYQs. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    const debounce = setTimeout(fetchPapers, 300)
    return () => clearTimeout(debounce)
  }, [fetchPapers])

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8 text-primary-400" />
          <h1 className="section-title">Previous Year Papers</h1>
        </div>
        <p className="section-subtitle text-base">
          Study smarter with past year question papers. Filter by course name, course code, or exam type.
        </p>
      </div>

      {/* Filter */}
      <FilterBar filters={filters} onChange={setFilters} />

      {/* Results count */}
      {!loading && !error && (
        <p className="text-sm text-gray-500 mb-4">
          {papers.length === 0 ? 'No PYQs found.' : `${papers.length} PYQ${papers.length > 1 ? 's' : ''} found`}
        </p>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card p-5 space-y-3 animate-pulse">
              <div className="h-4 bg-gray-800 rounded w-3/4" />
              <div className="h-3 bg-gray-800 rounded w-1/2" />
              <div className="h-px bg-gray-800" />
              <div className="h-8 bg-gray-800 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="card p-8 text-center">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-red-400 font-medium mb-4">{error}</p>
          <button onClick={fetchPapers} className="btn-secondary text-sm">
            Try Again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && papers.length === 0 && (
        <div className="card p-12 text-center flex flex-col items-center">
          <Inbox className="w-12 h-12 text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No PYQs found</h3>
          <p className="text-gray-400 text-sm mb-6">
            {Object.values(filters).some(Boolean)
              ? 'No PYQs match your current filters. Try adjusting or clearing them.'
              : 'No PYQs have been uploaded yet. Be the first to contribute!'}
          </p>
          <a href="/upload" className="btn-primary text-sm">Upload a Paper</a>
        </div>
      )}

      {/* Papers grid */}
      {!loading && !error && papers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {papers.map((paper) => (
            <PaperCard key={paper._id} paper={paper} />
          ))}
        </div>
      )}
    </div>
  )
}
