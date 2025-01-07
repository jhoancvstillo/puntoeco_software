'use client'

import { useState } from 'react'
import { Map } from './Map'
import { useSimulateMultipleGPS, Vehicle } from './SimulateGPS'
import { VehicleDetails } from './VehicleDetails'
import Draggable from 'react-draggable'

export function GPSTracker() {
  const vehicles = useSimulateMultipleGPS(10)
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>(vehicles.map(v => v.id))
  const [activeVehicle, setActiveVehicle] = useState<Vehicle | null>(null)

  const handleVehicleToggle = (vehicleId: string) => {
    setSelectedVehicles(prev =>
      prev.includes(vehicleId)
        ? prev.filter(id => id !== vehicleId)
        : [...prev, vehicleId]
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-grow relative">
        <Map 
          vehicles={vehicles}
          selectedVehicles={selectedVehicles}
          onVehicleSelect={setActiveVehicle}
          onVehicleToggle={handleVehicleToggle}
        />
        {activeVehicle && (
          <Draggable handle=".handle" bounds="parent">
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-md cursor-move">
              <div className="handle flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Detalles del vehiculo</h3>
                <button onClick={() => setActiveVehicle(null)} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>
              <VehicleDetails vehicle={activeVehicle} />
            </div>
          </Draggable>
        )}
      </div>
    </div>
  )
}

