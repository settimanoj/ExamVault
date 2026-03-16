import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { uploadPaper } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { PDFDocument } from 'pdf-lib'

const EXAM_TYPES = ['CAT1', 'CAT2', 'FAT', 'Others']
const CATEGORIES = ['Slot Paper', 'PYQ']
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
const ALLOWED_EXTS = ['.pdf', '.jpg', '.jpeg', '.png']

export default function UploadPage() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    courseName: '',
    courseCode: '',
    slot: '',
    examType: '',
    category: '',
  })
  const [files, setFiles] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [errors, setErrors] = useState({})
  const fileRef = useRef()

  const validate = () => {
    const errs = {}
    if (!form.courseName.trim()) errs.courseName = 'Course name is required'
    if (!form.courseCode.trim()) errs.courseCode = 'Course code is required'
    if (!form.slot.trim()) errs.slot = 'Slot is required'
    if (!form.examType) errs.examType = 'Exam type is required'
    if (!form.category) errs.category = 'Category is required'

    if (!files.length) {
      errs.file = 'Please select at least one file to upload'
    } else {
      const invalid = files.find((f) => !ALLOWED_TYPES.includes(f.type))
      if (invalid) {
        errs.file = 'Files must be PDF, JPG, JPEG, or PNG'
      }

      const tooLarge = files.find((f) => f.size > 20 * 1024 * 1024)
      if (tooLarge) {
        errs.file = 'Each file must be under 20 MB'
      }

      const hasPdf = files.some((f) => f.type === 'application/pdf')
      if (files.length > 1 && hasPdf) {
        errs.file = 'Multi-page upload supports multiple images. Upload a single PDF or multiple images.'
      }
    }
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleFiles = (selectedFiles) => {
    const next = Array.from(selectedFiles || []).filter((f) => ALLOWED_TYPES.includes(f.type))
    if (!next.length) return
    setFiles(next)
    setErrors((prev) => ({ ...prev, file: '' }))
  }

  const handleFileDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files?.length) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const describeFile = (file) => {
    const sizeMb = (file.size / 1024 / 1024).toFixed(2)
    const ext = ALLOWED_EXTS.find((e) => file.name.toLowerCase().endsWith(e)) || ''
    return `${ext || file.type} · ${sizeMb} MB`
  }

  const buildFormDataWithSingleFile = async () => {
    const formData = new FormData()
    Object.entries(form).forEach(([k, v]) => formData.append(k, v))

    if (files.length === 1 && files[0].type === 'application/pdf') {
      formData.append('file', files[0])
      return formData
    }

    const pdfDoc = await PDFDocument.create()

    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const mime = file.type

      let embedded
      if (mime === 'image/jpeg' || mime === 'image/jpg') {
        embedded = await pdfDoc.embedJpg(bytes)
      } else if (mime === 'image/png') {
        embedded = await pdfDoc.embedPng(bytes)
      } else {
        continue
      }

      const { width, height } = embedded
      const page = pdfDoc.addPage([width, height])
      page.drawImage(embedded, { x: 0, y: 0, width, height })
    }

    const pdfBytes = await pdfDoc.save()
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' })
    const mergedFile = new File([pdfBlob], 'examvault-paper.pdf', { type: 'application/pdf' })

    formData.append('file', mergedFile)
    return formData
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setUploading(true)
    setProgress(0)

    try {
      const formData = await buildFormDataWithSingleFile()

      await uploadPaper(formData, (evt) => {
        if (evt.total) {
          setProgress(Math.round((evt.loaded / evt.total) * 100))
        }
      })
      toast.success('Paper uploaded successfully.')
      setForm({ courseName: '', courseCode: '', slot: '', examType: '', category: '' })
      setFiles([])
      setProgress(0)
      if (fileRef.current) fileRef.current.value = ''
    } catch (err) {
      const msg = err.response?.data?.message || 'Upload failed. Please try again.'
      toast.error(msg)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title mb-2">Upload Question Paper</h1>
          <p className="section-subtitle text-base">
            Share exam papers with your fellow students. Accepted: PDF, JPG, JPEG, PNG (max 20 MB).
          </p>
          <div className="mt-4 inline-flex items-center gap-3 rounded-2xl border border-primary-500/20 bg-primary-500/10 px-4 py-3 text-sm text-primary-100">
            <img
              src={user?.profilePicture}
              alt={user?.name}
              className="w-10 h-10 rounded-xl object-cover border border-primary-500/20"
            />
            <div>
              <p className="font-semibold text-white">{user?.name}</p>
              <p className="text-primary-200/80">{user?.email}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-5" noValidate>
          {/* Course Name */}
          <div>
            <label className="label" htmlFor="courseName">Course Name</label>
            <input
              id="courseName"
              name="courseName"
              type="text"
              value={form.courseName}
              onChange={handleChange}
              placeholder="e.g. Data Structures and Algorithms"
              className={`input-field ${errors.courseName ? 'border-red-500/70 focus:ring-red-500/40' : ''}`}
            />
            {errors.courseName && <p className="text-red-400 text-xs mt-1">{errors.courseName}</p>}
          </div>

          {/* Course Code + Slot row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="courseCode">Course Code</label>
              <input
                id="courseCode"
                name="courseCode"
                type="text"
                value={form.courseCode}
                onChange={handleChange}
                placeholder="e.g. CSE2007"
                className={`input-field ${errors.courseCode ? 'border-red-500/70 focus:ring-red-500/40' : ''}`}
              />
              {errors.courseCode && <p className="text-red-400 text-xs mt-1">{errors.courseCode}</p>}
            </div>
            <div>
              <label className="label" htmlFor="slot">Slot</label>
              <select
                id="slot"
                name="slot"
                value={form.slot}
                onChange={handleChange}
                className={`input-field ${errors.slot ? 'border-red-500/70 focus:ring-red-500/40' : ''}`}
              >
                <option value="">Select slot</option>
                {['A1','A2','B1','B2','C1','C2','D1','D2','E1','E2','F1','F2','G1','G2'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.slot && <p className="text-red-400 text-xs mt-1">{errors.slot}</p>}
            </div>
          </div>

          {/* Exam Type + Category row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="examType">Exam Type</label>
              <select
                id="examType"
                name="examType"
                value={form.examType}
                onChange={handleChange}
                className={`input-field ${errors.examType ? 'border-red-500/70 focus:ring-red-500/40' : ''}`}
              >
                <option value="">Select exam type</option>
                {EXAM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.examType && <p className="text-red-400 text-xs mt-1">{errors.examType}</p>}
            </div>
            <div>
              <label className="label" htmlFor="category">Paper Category</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`input-field ${errors.category ? 'border-red-500/70 focus:ring-red-500/40' : ''}`}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="label">File Upload</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              onClick={() => fileRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200
                ${dragOver
                  ? 'border-primary-500 bg-primary-600/10'
                  : errors.file
                    ? 'border-red-500/50 bg-red-900/5'
                    : 'border-gray-700 bg-gray-800/30 hover:border-primary-600/60 hover:bg-primary-900/10'
                }
              `}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
                id="file-input"
              />
              {files.length ? (
                <div className="space-y-3 text-left">
                  <p className="text-xs text-primary-200">
                    Multi-page upload enabled — selected files will be merged into a single PDF in
                    the order shown below.
                  </p>
                  <ul className="space-y-2 max-h-40 overflow-auto pr-1">
                    {files.map((f, index) => (
                      <li
                        key={`${f.name}-${index}`}
                        className="flex items-center justify-between gap-3 rounded-xl border border-gray-700/70 bg-gray-900/60 px-3 py-2"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800 text-xs text-gray-300">
                            {index + 1}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm text-white">{f.name}</p>
                            <p className="truncate text-[11px] text-gray-400">
                              {describeFile(f)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="text-[11px] font-medium text-gray-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-gray-500">
                    To adjust page order, re-select files in the desired sequence.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-300 font-medium text-sm">
                      Drop files here, or <span className="text-primary-400">browse</span>
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      PDF, JPG, JPEG, PNG — up to 20 MB each. Multiple images will be merged into a
                      single PDF.
                    </p>
                  </div>
                </div>
              )}
            </div>
            {errors.file && <p className="text-red-400 text-xs mt-1">{errors.file}</p>}
          </div>

          {/* Progress bar */}
          {uploading && progress > 0 && (
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-600 to-accent-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="btn-primary w-full py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            id="upload-submit-btn"
          >
            {uploading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Paper
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
