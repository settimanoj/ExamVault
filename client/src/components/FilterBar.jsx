import { useState } from 'react'

const EXAM_TYPES = ['CAT1', 'CAT2', 'FAT', 'Others']

export default function FilterBar({ filters, onChange, showSlot = false }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange({ ...filters, [name]: value })
  }

  const clearFilters = () => {
    onChange(
      showSlot
        ? { courseName: '', courseCode: '', slot: '', examType: '' }
        : { courseName: '', courseCode: '', examType: '' }
    )
  }

  const hasActiveFilters =
    filters.courseName || filters.courseCode || filters.examType || (showSlot && filters.slot)

  return (
    <div className="card p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filter Papers
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
            id="filter-clear-btn"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear filters
          </button>
        )}
      </div>
      <div className={`grid grid-cols-1 ${showSlot ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} gap-3`}>
        <div>
          <label className="label text-xs" htmlFor="filter-courseName">Course Name</label>
          <input
            id="filter-courseName"
            type="text"
            name="courseName"
            value={filters.courseName}
            onChange={handleChange}
            placeholder="e.g. Data Structures and Algorithms"
            className="input-field text-sm py-2"
          />
        </div>
        <div>
          <label className="label text-xs" htmlFor="filter-courseCode">Course Code</label>
          <input
            id="filter-courseCode"
            type="text"
            name="courseCode"
            value={filters.courseCode}
            onChange={handleChange}
            placeholder="e.g. CSE2007"
            className="input-field text-sm py-2"
          />
        </div>
        {showSlot && (
          <div>
            <label className="label text-xs" htmlFor="filter-slot">Slot</label>
            <select
              id="filter-slot"
              name="slot"
              value={filters.slot}
              onChange={handleChange}
              className="input-field text-sm py-2"
            >
              <option value="">All slots</option>
              {['A1','A2','B1','B2','C1','C2','D1','D2','E1','E2','F1','F2','G1','G2'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="label text-xs" htmlFor="filter-examType">Exam Type</label>
          <select
            id="filter-examType"
            name="examType"
            value={filters.examType}
            onChange={handleChange}
            className="input-field text-sm py-2"
          >
            <option value="">All Types</option>
            {EXAM_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
