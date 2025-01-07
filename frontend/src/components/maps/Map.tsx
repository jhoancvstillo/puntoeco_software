import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Vehicle } from './SimulateGPS'
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2, Target, List, X } from 'lucide-react'
import { VehicleSelector } from './VehicleSelector'
import Draggable from 'react-draggable'
import { VehicleDetails } from './VehicleDetails'
import { MapProps } from '@/types/gps'

export function Map({ vehicles, selectedVehicles, onVehicleSelect, onVehicleToggle }: MapProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<{ [key: string]: L.Marker }>({})

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showVehicleSelector, setShowVehicleSelector] = useState(false)
  const [activeVehicle, setActiveVehicle] = useState<Vehicle | null>(null)
  const initialLat = -27.370444;
  const initialLon = -70.327778;

  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        zoomControl: false
      }).setView([initialLat, initialLon], 12)
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current)
      
      L.control.zoom({
        position: 'bottomright'
      }).addTo(mapInstanceRef.current)
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (mapInstanceRef.current) {
      vehicles.forEach((vehicle) => {
        const { gpsData } = vehicle
        let lat: number = gpsData.latitude.degrees + parseFloat(gpsData.latitude.minutes) / 60
        let lng: number = gpsData.longitude.degrees + parseFloat(gpsData.longitude.minutes) / 60
        
        if (gpsData.latitude.direction === 'S') lat *= -1
        if (gpsData.longitude.direction === 'W') lng *= -1

        if (markersRef.current[vehicle.id]) {
          markersRef.current[vehicle.id].setLatLng([lat, lng])
        } else {
          const icon = L.divIcon({
            className: 'custom-icon text-4xl',
            html: vehicle.type === 'car' ? '🚗' : '🚚',
            iconSize: [80, 80],
            iconAnchor: [40, 40],
          })
          markersRef.current[vehicle.id] = L.marker([lat, lng], { icon })
            .addTo(mapInstanceRef.current!)
            .on('click', () => {
              setActiveVehicle(vehicle)
              onVehicleSelect(vehicle)
            })
        }

        if (selectedVehicles.includes(vehicle.id)) {
          markersRef.current[vehicle.id].addTo(mapInstanceRef.current!)
        } else {
          mapInstanceRef.current?.removeLayer(markersRef.current[vehicle.id])
        }
      })

      Object.keys(markersRef.current).forEach((id) => {
        if (!vehicles.some((v) => v.id === id)) {
          mapInstanceRef.current?.removeLayer(markersRef.current[id])
          delete markersRef.current[id]
        }
      })
    }
  }, [vehicles, selectedVehicles, onVehicleSelect])

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize()
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const toggleFullscreen = () => {
    if (!wrapperRef.current) return

    if (!document.fullscreenElement) {
      wrapperRef.current.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
    setIsFullscreen(!isFullscreen)
  }

  const centerMap = () => {
    if (mapInstanceRef.current && Object.keys(markersRef.current).length > 0) {
      const group = L.featureGroup(Object.values(markersRef.current))
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1))
    }
  }

  return (
    <div ref={wrapperRef} className="relative  w-full h-full">
      <div ref={mapContainerRef} className=" h-full" />
      <div className="absolute top-4 right-4 z-[1000] space-y-2">
        <Button
          onClick={toggleFullscreen}
          className="w-10 h-10 p-2"
          variant="secondary"
        >
          {isFullscreen ? <Minimize2 className="h-6 w-6" /> : <Maximize2 className="h-6 w-6" />}
        </Button>
        <Button
          onClick={centerMap}
          className="w-10 h-10 p-2"
          variant="secondary"
        >
          <Target className="h-6 w-6" />
        </Button>
        <Button
          onClick={() => setShowVehicleSelector(!showVehicleSelector)}
          className="w-10 h-10 p-2"
          variant="secondary"
        >
          <List className="h-6 w-6" />
        </Button>
      </div>

      {showVehicleSelector && (
        <div className="absolute top-4 left-4 z-[1000] bg-white p-4 rounded-lg shadow-lg">
          <VehicleSelector
            vehicles={vehicles}
            selectedVehicles={selectedVehicles}
            onVehicleToggle={onVehicleToggle}
          />
        </div>
      )}

      {activeVehicle && (
        <Draggable handle=".handle" bounds="parent">
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-md cursor-move z-[1000]">
            <div className="handle flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Detalles del vehiculo</h3>
              <Button variant="ghost" size="sm" onClick={() => setActiveVehicle(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <VehicleDetails vehicle={activeVehicle} />
          </div>
        </Draggable>
      )}
    </div>
  )
}


