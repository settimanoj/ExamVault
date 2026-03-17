import { useState } from 'react'
import { BarChart, Target, AlertTriangle } from 'lucide-react'

// ——————————————————————————————————————
// Grade mapping
// ——————————————————————————————————————
const gradePoints = { S: 10, A: 9, B: 8, C: 7, D: 6, E: 5, F: 0 }
const gradeOptions = Object.keys(gradePoints)

const MAX_CREDITS = 27
const emptyGpaRow = () => ({ id: Date.now() + Math.random(), credits: '', grade: 'S' })
const emptyCgpaRow = () => ({ id: Date.now() + Math.random(), credits: '', gpa: '' })

// ——————————————————————————————————————
// GPA Calculator
// ——————————————————————————————————————
function GPACalculator() {
  const [rows, setRows] = useState([emptyGpaRow()])
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const addRow = () => setRows((prev) => [...prev, emptyGpaRow()])

  const removeRow = (id) => {
    if (rows.length === 1) return
    setRows((prev) => prev.filter((r) => r.id !== id))
    setResult(null)
    setError('')
  }

  const handleChange = (id, field, value) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
    setResult(null)
    setError('')
  }

  const calculate = () => {
    let totalCredits = 0
    let weightedSum = 0

    for (const row of rows) {
      const credits = parseFloat(row.credits)
      if (isNaN(credits) || credits <= 0) {
        setError('All credit values must be positive numbers.')
        setResult(null)
        return
      }
      totalCredits += credits
      weightedSum += credits * gradePoints[row.grade]
    }

    if (totalCredits > MAX_CREDITS) {
      setError(`Total credits cannot exceed ${MAX_CREDITS}. Current total: ${totalCredits}.`)
      setResult(null)
      return
    }

    setError('')
    setResult({ gpa: (weightedSum / totalCredits).toFixed(2), totalCredits })
  }

  const reset = () => {
    setRows([emptyGpaRow()])
    setResult(null)
    setError('')
  }

  const totalCreditsLive = rows.reduce((sum, r) => sum + (parseFloat(r.credits) || 0), 0)

  return (
    <div className="card p-6 sm:p-8 flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart className="w-6 h-6 text-primary-400" /> GPA Calculator
          </h2>
          <p className="text-gray-400 text-sm mt-1">Per-semester GPA based on credits & grades</p>
        </div>
        <div className={`text-right text-sm ${totalCreditsLive > MAX_CREDITS ? 'text-red-400' : 'text-gray-400'}`}>
          <div className="font-bold text-base">
            {totalCreditsLive} / {MAX_CREDITS}
          </div>
          <div className="text-xs">Credits used</div>
        </div>
      </div>

      {/* Header row */}
      <div className="grid grid-cols-[1fr_120px_40px] gap-3 text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">
        <span>Credits</span>
        <span>Grade</span>
        <span></span>
      </div>

      {/* Subject rows */}
      <div className="space-y-3">
        {rows.map((row, idx) => (
          <div key={row.id} className="grid grid-cols-[1fr_120px_40px] gap-3 items-center animate-fade-in">
            <div className="relative">
              <input
                type="number"
                min="0.5"
                max={MAX_CREDITS}
                step="0.5"
                value={row.credits}
                onChange={(e) => handleChange(row.id, 'credits', e.target.value)}
                placeholder={`Subject ${idx + 1} credits`}
                className="input-field py-2.5 text-sm"
                id={`gpa-credits-${idx}`}
              />
            </div>
            <select
              value={row.grade}
              onChange={(e) => handleChange(row.id, 'grade', e.target.value)}
              className="input-field py-2.5 text-sm"
              id={`gpa-grade-${idx}`}
            >
              {gradeOptions.map((g) => (
                <option key={g} value={g}>{g} ({gradePoints[g]} pts)</option>
              ))}
            </select>
            <button
              onClick={() => removeRow(row.id)}
              disabled={rows.length === 1}
              className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-red-900/60 text-gray-500 hover:text-red-400 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
              title="Remove subject"
              id={`gpa-remove-${idx}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Add row */}
      <button
        onClick={addRow}
        className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors font-medium w-fit"
        id="gpa-add-subject"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add subject
      </button>

      {/* Error */}
      {error && (
        <div className="bg-red-900/20 border border-red-700/40 rounded-xl px-4 py-3 text-red-400 text-sm flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="bg-primary-900/20 border border-primary-700/40 rounded-2xl px-6 py-5 text-center animate-fade-in">
          <p className="text-gray-400 text-sm mb-1">Your Semester GPA</p>
          <p className="text-5xl font-extrabold gradient-text">{result.gpa}</p>
          <p className="text-gray-500 text-xs mt-2">Based on {result.totalCredits} total credits</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <button onClick={calculate} className="btn-primary flex-1" id="gpa-calculate-btn">
          Calculate GPA
        </button>
        <button onClick={reset} className="btn-secondary px-4" title="Reset" id="gpa-reset-btn">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// ——————————————————————————————————————
// CGPA Calculator
// ——————————————————————————————————————
function CGPACalculator() {
  const [rows, setRows] = useState([emptyCgpaRow()])
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const addRow = () => setRows((prev) => [...prev, emptyCgpaRow()])

  const removeRow = (id) => {
    if (rows.length === 1) return
    setRows((prev) => prev.filter((r) => r.id !== id))
    setResult(null)
    setError('')
  }

  const handleChange = (id, field, value) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
    setResult(null)
    setError('')
  }

  const calculate = () => {
    let totalCredits = 0
    let weightedSum = 0

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const credits = parseFloat(row.credits)
      const gpa = parseFloat(row.gpa)

      if (isNaN(credits) || credits <= 0) {
        setError(`Semester ${i + 1}: Credits must be a positive number.`)
        setResult(null)
        return
      }
      if (isNaN(gpa) || gpa < 0 || gpa > 10) {
        setError(`Semester ${i + 1}: GPA must be between 0 and 10.`)
        setResult(null)
        return
      }
      totalCredits += credits
      weightedSum += credits * gpa
    }

    setError('')
    setResult({ cgpa: (weightedSum / totalCredits).toFixed(2), totalCredits, semesters: rows.length })
  }

  const reset = () => {
    setRows([emptyCgpaRow()])
    setResult(null)
    setError('')
  }

  return (
    <div className="card p-6 sm:p-8 flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Target className="w-6 h-6 text-primary-400" /> CGPA Calculator
        </h2>
        <p className="text-gray-400 text-sm mt-1">CGPA across all semesters</p>
        <p className="text-[11px] text-amber-300/80 mt-1 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5" />
          Exclude Pass/Fail (P/F) courses. Do not add their credits to the semester total.
        </p>
      </div>



      {/* Header row */}
      <div className="grid grid-cols-[1fr_1fr_40px] gap-3 text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">
        <span>Total Credits</span>
        <span>GPA (0–10)</span>
        <span></span>
      </div>

      {/* Semester rows */}
      <div className="space-y-3">
        {rows.map((row, idx) => (
          <div key={row.id} className="grid grid-cols-[1fr_1fr_40px] gap-3 items-center animate-fade-in">
            <input
              type="number"
              min="1"
              step="0.5"
              value={row.credits}
              onChange={(e) => handleChange(row.id, 'credits', e.target.value)}
              placeholder={`Sem ${idx + 1} credits`}
              className="input-field py-2.5 text-sm"
              id={`cgpa-credits-${idx}`}
            />
            <input
              type="number"
              min="0"
              max="10"
              step="0.01"
              value={row.gpa}
              onChange={(e) => handleChange(row.id, 'gpa', e.target.value)}
              placeholder="e.g. 8.75"
              className="input-field py-2.5 text-sm"
              id={`cgpa-gpa-${idx}`}
            />
            <button
              onClick={() => removeRow(row.id)}
              disabled={rows.length === 1}
              className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-red-900/60 text-gray-500 hover:text-red-400 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
              title="Remove semester"
              id={`cgpa-remove-${idx}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Add semester */}
      <button
        onClick={addRow}
        className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors font-medium w-fit"
        id="cgpa-add-semester"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add semester
      </button>

      {/* Error */}
      {error && (
        <div className="bg-red-900/20 border border-red-700/40 rounded-xl px-4 py-3 text-red-400 text-sm flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="bg-primary-900/20 border border-primary-700/40 rounded-2xl px-6 py-5 text-center animate-fade-in">
          <p className="text-gray-400 text-sm mb-1">Your CGPA</p>
          <p className="text-5xl font-extrabold gradient-text">{result.cgpa}</p>
          <p className="text-gray-500 text-xs mt-2">
            Across {result.semesters} semester{result.semesters > 1 ? 's' : ''} · {result.totalCredits} total credits
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <button onClick={calculate} className="btn-primary flex-1" id="cgpa-calculate-btn">
          Calculate CGPA
        </button>
        <button onClick={reset} className="btn-secondary px-4" title="Reset" id="cgpa-reset-btn">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// ——————————————————————————————————————
// Main page
// ——————————————————————————————————————
export default function CalculatorPage() {
  return (
    <div className="page-container animate-fade-in">
      <div className="mb-8">
        <h1 className="section-title mb-2">GPA & CGPA Calculator</h1>
        <p className="section-subtitle text-base">
          Calculate your semester GPA and CGPA using VIT-AP's grading system.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GPACalculator />
        <CGPACalculator />
      </div>
    </div>
  )
}
