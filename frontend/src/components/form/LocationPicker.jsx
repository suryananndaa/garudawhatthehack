import { useState, useEffect, useRef } from 'react'
import './LocationPicker.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const GPS_PATTERN = /^GPS\s*\(/i

async function searchPlaces(query) {
  if (query.length < 2) return []
  try {
    const res = await fetch(`${API_URL}/api/geocode/search?q=${encodeURIComponent(query)}`)
    if (!res.ok) return []
    const data = await res.json()
    return data.results ?? []
  } catch { return [] }
}

async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(`${API_URL}/api/geocode/reverse?lat=${lat}&lon=${lon}`)
    if (!res.ok) return ''
    const data = await res.json()
    return data.label ?? ''
  } catch { return '' }
}

export default function LocationPicker({ value, onChange, onCoordsChange, initialCoords }) {
  const [input, setInput]             = useState(value || '')
  const [suggestions, setSuggestions]   = useState([])
  const [showSugg, setShowSugg]       = useState(false)
  const [gpsStatus, setGpsStatus]     = useState('idle') // idle | loading | ok | error
  const [confirmed, setConfirmed]     = useState(!!value && !GPS_PATTERN.test(value || ''))
  const debounceRef                   = useRef(null)
  const resolvedRef                   = useRef(false)

  useEffect(() => {
    const v = value || ''
    setInput(v)
    setConfirmed(!!v && !GPS_PATTERN.test(v))
  }, [value])

  useEffect(() => {
    if (initialCoords) return
  }, [initialCoords])

  // Perbaiki label lama "GPS (...)" atau kosong tapi ada koordinat
  useEffect(() => {
    if (resolvedRef.current || !initialCoords) return
    const needsResolve = !value || GPS_PATTERN.test(value)
    if (!needsResolve) return
    resolvedRef.current = true
    reverseGeocode(initialCoords.lat, initialCoords.lon).then((nama) => {
      if (nama) {
        setInput(nama)
        setConfirmed(true)
        onChange(nama)
      }
    })
    // hanya sekali saat mount / initialCoords tersedia
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCoords])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!input.trim() || confirmed) { setSuggestions([]); return }
    debounceRef.current = setTimeout(async () => {
      const results = await searchPlaces(input)
      setSuggestions(results)
      setShowSugg(results.length > 0)
    }, 350)
  }, [input, confirmed])

  const handleGPS = () => {
    if (!navigator.geolocation) { setGpsStatus('error'); return }
    setGpsStatus('loading')
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude
      const lon = pos.coords.longitude
      const c = { lat, lon }
      onCoordsChange?.(c)

      const nama = await reverseGeocode(lat, lon)
      if (nama) {
        setInput(nama)
        setConfirmed(true)
        setGpsStatus('ok')
        onChange(nama)
      } else {
        setGpsStatus('error')
        setConfirmed(false)
      }
    }, () => setGpsStatus('error'), { timeout: 10000, enableHighAccuracy: true })
  }

  const handleSelect = (s) => {
    setInput(s.label)
    setConfirmed(true)
    setSuggestions([])
    setShowSugg(false)
    const c = { lat: s.lat, lon: s.lon }
    onChange(s.label)
    onCoordsChange?.(c)
  }

  const handleReset = () => {
    setInput('')
    setConfirmed(false)
    setGpsStatus('idle')
    setSuggestions([])
    onChange('')
    onCoordsChange?.(null)
  }

  return (
    <div className="location-picker">
      {!confirmed && (
        <button type="button" className="location-picker__gps-btn" onClick={handleGPS} disabled={gpsStatus === 'loading'}>
          {gpsStatus === 'loading' ? '⏳ Mendeteksi lokasi & nama daerah...'
            : gpsStatus === 'error' ? '❌ GPS gagal — ketik nama daerah di bawah'
            : '📡 Gunakan GPS otomatis'}
        </button>
      )}

      {confirmed ? (
        <div className="location-picker__confirmed">
          <span className="location-picker__confirmed-label">📍 {input}</span>
          <button type="button" onClick={handleReset} className="location-picker__reset">Ganti</button>
        </div>
      ) : (
        <div className="location-picker__input-wrap">
          <input
            type="text"
            className="location-picker__input"
            placeholder="Ketik desa, kecamatan, kabupaten... (contoh: jaka)"
            value={input}
            onChange={e => { setInput(e.target.value); setConfirmed(false); setGpsStatus('idle') }}
            onFocus={() => suggestions.length > 0 && setShowSugg(true)}
            onBlur={() => setTimeout(() => setShowSugg(false), 200)}
            autoComplete="off"
          />
          {showSugg && (
            <div className="location-picker__suggestions">
              {suggestions.map((s, i) => (
                <button key={i} type="button" className="location-picker__suggestion-item"
                  onMouseDown={() => handleSelect(s)}>
                  <span className="location-picker__suggestion-title">{s.title}</span>
                  {s.subtitle && (
                    <span className="location-picker__suggestion-sub">{s.subtitle}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
