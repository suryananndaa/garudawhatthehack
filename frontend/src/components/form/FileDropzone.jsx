import { useRef, useState } from 'react'
import { FileText, ImageIcon } from 'lucide-react'
import './FileDropzone.css'

export default function FileDropzone({ onFileSelect, maxSizeMb = 10, accept = 'image/png,image/jpeg' }) {
  const inputRef = useRef(null)
  const [fileName, setFileName] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = (files) => {
    const file = files?.[0]
    if (!file) return
    setFileName(file.name)
    onFileSelect?.(file)
  }

  return (
    <div
      className={`file-dropzone ${isDragging ? 'file-dropzone--dragging' : ''}`}
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        handleFiles(e.dataTransfer.files)
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="file-dropzone__input"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {fileName ? (
        <>
          <ImageIcon size={36} strokeWidth={1.5} className="file-dropzone__icon" />
          <p className="file-dropzone__text">{fileName}</p>
          <p className="file-dropzone__hint">Klik untuk ganti foto</p>
        </>
      ) : (
        <>
          <FileText size={36} strokeWidth={1.5} className="file-dropzone__icon" />
          <p className="file-dropzone__text">
            Klik untuk upload foto
            <br />
            atau drag and drop
          </p>
          <p className="file-dropzone__hint">
            PNG, JPG maksimal {maxSizeMb}MB
          </p>
        </>
      )}
    </div>
  )
}
