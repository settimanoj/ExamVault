const examTypeBadgeMap = {
  CAT1: 'badge-blue',
  CAT2: 'badge-orange',
  FAT: 'badge-purple',
  Others: 'badge bg-gray-700 text-gray-300',
}

const categoryBadgeMap = {
  'Slot Paper': 'badge-green',
  PYQ: 'badge-purple',
}

export default function PaperCard({
  paper,
  showUploader = false,
  canDelete = false,
  deleting = false,
  onDelete,
}) {
  const {
    courseName,
    courseCode,
    slot,
    examType,
    category,
    fileType,
    createdAt,
    uploader,
  } = paper

  const date = new Date(createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="card-hover p-5 flex flex-col gap-4 animate-fade-in">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-base leading-snug truncate">
            {courseName}
          </h3>
          <p className="text-primary-400 font-mono text-sm font-medium mt-0.5">
            {courseCode}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className={categoryBadgeMap[category] || 'badge bg-gray-700 text-gray-300'}>
            {category === 'Slot Paper' ? 'Recent Paper' : category}
          </span>
          <span className={examTypeBadgeMap[examType] || 'badge bg-gray-700 text-gray-300'}>
            {examType}
          </span>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Slot {slot}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {date}
        </span>
      </div>

      {showUploader && uploader && (
        <div className="flex items-center gap-3 rounded-2xl border border-gray-800 bg-gray-950/60 px-3 py-2">
          <img
            src={uploader.profilePicture}
            alt={uploader.name}
            className="w-10 h-10 rounded-xl object-cover border border-gray-700"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{uploader.name}</p>
            <p className="text-xs text-gray-400 truncate">{uploader.email}</p>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-gray-800/60" />

      <div className="flex flex-col gap-3">
        <a
          href={`/api/papers/${paper._id}/file`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full text-sm py-2.5"
          id={`view-paper-${paper._id}`}
        >
          {fileType === 'pdf' ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View / Download PDF
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              View Image
            </>
          )}
        </a>

        {canDelete && (
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="btn-danger w-full py-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {deleting ? 'Deleting...' : 'Delete File'}
          </button>
        )}
      </div>
    </div>
  )
}
