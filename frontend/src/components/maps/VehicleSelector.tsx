import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Vehicle } from './SimulateGPS'
import { useDarkMode } from '@/hooks/useDarkMode'

interface VehicleSelectorProps {
  vehicles: Vehicle[]
  selectedVehicles: string[]
  onVehicleToggle: (vehicleId: string) => void
}

export function VehicleSelector({ vehicles, selectedVehicles, onVehicleToggle }: VehicleSelectorProps) {
  const { darkMode } = useDarkMode()

  return (
    <div className={`space-y-4 max-h-[60vh] overflow-y-auto p-4 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Selecciona Vehículo</h2>
      {vehicles.map((vehicle) => (
        <div key={vehicle.id} className="flex items-center space-x-2 py-2">
          <Checkbox
            id={vehicle.id}
            checked={selectedVehicles.includes(vehicle.id)}
            onCheckedChange={() => onVehicleToggle(vehicle.id)}
            className={darkMode ? 'border-gray-600' : 'border-gray-300'}
          />
          <Label 
            htmlFor={vehicle.id} 
            className={`flex-grow cursor-pointer ${darkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-800'}`}
          >
            {vehicle.type === 'car' ? '🚗' : '🚚'} {vehicle.id}
          </Label>
        </div>
      ))}
    </div>
  )
}

