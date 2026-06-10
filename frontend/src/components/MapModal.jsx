import React, { useEffect, useRef, useState } from 'react'
import { Circle, MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
})

const INDIA_CENTER = [20.5937, 78.9629]

const toCoordinate = (value) => {
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

const getInitialPosition = (lat, lon) => {
  const latValue = toCoordinate(lat)
  const lonValue = toCoordinate(lon)
  return latValue !== null && lonValue !== null ? [latValue, lonValue] : INDIA_CENTER
}

const formatAddressDetails = (address) => {
  const safeAddress = address || {}
  const area = safeAddress.neighbourhood || safeAddress.suburb || safeAddress.village || safeAddress.town || safeAddress.city_district
  const city = safeAddress.city || safeAddress.town || safeAddress.village || safeAddress.county
  const state = safeAddress.state
  const postal = safeAddress.postcode
  return [area, city, state, postal].filter(Boolean).join(', ')
}

const getAddressTitle = (address, fallback) => {
  const safeAddress = address || {}
  return safeAddress.road || safeAddress.neighbourhood || safeAddress.suburb || safeAddress.village || safeAddress.town || safeAddress.city || fallback || 'Selected location'
}

function MapSync({ position }) {
  const map = useMap()

  useEffect(() => {
    if (!position || position.length !== 2) return
    // Set zoom based on expected accuracy: coarse sources (IP) should show a wider area.
    const currentZoom = map.getZoom()
    let targetZoom = 16
    try {
      // If the map or parent passed an accuracy hint on window (mapLocationAccuracy), prefer it
      const acc = window.__smallBasketMapAccuracy || null
      if (typeof acc === 'number') {
        if (acc <= 20) targetZoom = 18
        else if (acc <= 80) targetZoom = 17
        else if (acc <= 400) targetZoom = 14
        else targetZoom = 11
      } else {
        // Keep a reasonable zoom but don't force extremely close zooms when position may be approximate
        targetZoom = Math.max(Math.min(currentZoom, 17), 13)
      }
    } catch (e) {
      targetZoom = Math.max(Math.min(currentZoom, 17), 13)
    }
    map.setView(position, targetZoom, { animate: true })
    const timer = setTimeout(() => map.invalidateSize(), 120)
    return () => clearTimeout(timer)
  }, [map, position])

  return null
}

function DraggableMarker({ position, onPositionChange }) {
  const [pos, setPos] = useState(position)
  const markerRef = useRef(null)

  useMapEvents({
    click(event) {
      const next = [event.latlng.lat, event.latlng.lng]
      setPos(next)
      onPositionChange(next)
    }
  })

  useEffect(() => {
    setPos(position)
  }, [position])

  return (
    <Marker
      draggable
      eventHandlers={{
        dragend() {
          const marker = markerRef.current
          if (!marker) return
          const latlng = marker.getLatLng()
          const next = [latlng.lat, latlng.lng]
          setPos(next)
          onPositionChange(next)
        }
      }}
      position={pos}
      ref={markerRef}
    />
  )
}

export default function MapModal({ lat, lon, accuracy, label, details, onClose, onConfirm }) {
  const [position, setPosition] = useState(() => getInitialPosition(lat, lon))
  const [addr, setAddr] = useState(details || '')
  const [addressMeta, setAddressMeta] = useState(null)
  const [loading, setLoading] = useState(false)
  const [lookupError, setLookupError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const lookupRequestId = useRef(0)

  useEffect(() => {
    setPosition(getInitialPosition(lat, lon))
  }, [lat, lon])

  const reverseGeocode = async (latValue, lonValue) => {
    const requestId = lookupRequestId.current + 1
    lookupRequestId.current = requestId

    try {
      setLoading(true)
      setLookupError('')
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=18&lat=${encodeURIComponent(latValue)}&lon=${encodeURIComponent(lonValue)}`)
      if (!res.ok) throw new Error('Reverse geocode failed')
      const data = await res.json()
      if (requestId !== lookupRequestId.current) return null
      setAddr(data.display_name || '')
      setAddressMeta(data.address || null)
      return data
    } catch (err) {
      console.error('Reverse geocode error:', err)
      if (requestId === lookupRequestId.current) {
        setLookupError('Could not fetch the address for this pin. You can still confirm using coordinates.')
        setAddressMeta(null)
      }
      return null
    } finally {
      if (requestId === lookupRequestId.current) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    if (position && position.length === 2) {
      reverseGeocode(position[0], position[1])
    }
  }, [position])

  const handleSearch = async (event) => {
    event.preventDefault()
    const query = searchQuery.trim()
    if (!query) return

    try {
      setSearchLoading(true)
      setLookupError('')
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&countrycodes=in&q=${encodeURIComponent(query)}`)
      if (!res.ok) throw new Error('Location search failed')
      const results = await res.json()
      const nextResults = Array.isArray(results) ? results : []
      setSearchResults(nextResults)
      if (nextResults.length === 0) {
        setLookupError('No matching locations found. Try adding area, city, or PIN code.')
      }
    } catch (err) {
      console.error('Location search error:', err)
      setLookupError('Unable to search right now. Try moving the pin manually.')
    } finally {
      setSearchLoading(false)
    }
  }

  const selectSearchResult = (result) => {
    const nextLat = toCoordinate(result.lat)
    const nextLon = toCoordinate(result.lon)
    if (nextLat === null || nextLon === null) return

    setAddr(result.display_name || '')
    setAddressMeta(result.address || null)
    setSearchResults([])
    setSearchQuery(result.display_name || searchQuery)
    setPosition([nextLat, nextLon])
  }

  const confirm = () => {
    const fallbackAddress = `Lat: ${position[0].toFixed(6)}, Lon: ${position[1].toFixed(6)}`
    const locationDetails = formatAddressDetails(addressMeta)
    const payload = {
      id: `map-${Date.now()}`,
      label: label || 'Selected location',
      title: getAddressTitle(addressMeta, label),
      address: addr || fallbackAddress,
      details: locationDetails || details || 'Pinned from map',
      locationDetails,
      geocode: addressMeta,
      lat: position[0],
      lon: position[1],
      accuracy: accuracy || null
    }

    onConfirm && onConfirm(payload)
  }

  const detailText = formatAddressDetails(addressMeta)
  const accuracyText = accuracy ? `GPS accuracy: about ${Math.round(accuracy)} m` : ''

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '92%', maxWidth: '900px', background: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '14px', alignItems: 'start', padding: '12px 16px', borderBottom: '1px solid #eee' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700 }}>{label || 'Choose location'}</div>
            <div style={{ fontSize: '13px', color: '#666', marginTop: '4px', lineHeight: 1.45 }}>
              {loading ? 'Looking up address...' : (addr || details || 'Drag the marker or click on map to reposition')}
            </div>
            {detailText && <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{detailText}</div>}
            {accuracyText && <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{accuracyText}</div>}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>x</button>
        </div>

        <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', padding: '12px 16px', borderBottom: '1px solid #eee', background: '#fafafa' }}>
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search area, landmark, city, or PIN code"
            style={{ width: '100%', border: '1px solid #ddd', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
          />
          <button type="submit" disabled={searchLoading} style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: 'rgb(94,148,0)', color: '#fff', cursor: searchLoading ? 'not-allowed' : 'pointer', fontWeight: 700 }}>
            {searchLoading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {searchResults.length > 0 && (
          <div style={{ maxHeight: '150px', overflowY: 'auto', borderBottom: '1px solid #eee', background: '#fff' }}>
            {searchResults.map((result) => (
              <button
                key={`${result.place_id}-${result.lat}-${result.lon}`}
                type="button"
                onClick={() => selectSearchResult(result)}
                style={{ width: '100%', padding: '10px 16px', textAlign: 'left', border: 'none', borderBottom: '1px solid #f1f1f1', background: '#fff', cursor: 'pointer', color: '#333', lineHeight: 1.4 }}
              >
                <div style={{ fontSize: '13px', fontWeight: 700 }}>{getAddressTitle(result.address, 'Location match')}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{result.display_name}</div>
              </button>
            ))}
          </div>
        )}

        <div style={{ height: '520px' }}>
          <MapContainer center={position} zoom={16} style={{ height: '100%', width: '100%' }}>
            <MapSync position={position} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {accuracy && <Circle center={position} radius={accuracy} pathOptions={{ color: 'rgb(94,148,0)', fillColor: 'rgb(94,148,0)', fillOpacity: 0.08, weight: 1 }} />}
            <DraggableMarker position={position} onPositionChange={setPosition} />
          </MapContainer>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '12px', padding: '12px', alignItems: 'center', borderTop: '1px solid #eee' }}>
          <div style={{ color: lookupError ? 'rgb(180, 72, 0)' : '#555', fontSize: '13px', lineHeight: 1.45 }}>
            {lookupError || addr || `Lat: ${position[0].toFixed(6)}, Lon: ${position[1].toFixed(6)}`}
          </div>
          <div style={{ whiteSpace: 'nowrap' }}>
            <button onClick={onClose} style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}>Cancel</button>
            <button onClick={confirm} style={{ padding: '8px 14px', borderRadius: '6px', border: 'none', background: 'rgb(94,148,0)', color: '#fff', cursor: 'pointer', marginLeft: '8px' }}>Confirm location</button>
          </div>
        </div>
      </div>
    </div>
  )
}
