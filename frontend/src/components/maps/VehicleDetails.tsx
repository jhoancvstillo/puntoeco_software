import { Vehicle } from "./SimulateGPS";
import { useDarkMode } from "@/hooks/useDarkMode";

interface VehicleDetailsProps {
  vehicle: Vehicle;
}

export function VehicleDetails({ vehicle }: VehicleDetailsProps) {
  const { gpsData } = vehicle;
  const lat =
    gpsData.latitude.degrees + parseFloat(gpsData.latitude.minutes) / 60;
  const lng =
    gpsData.longitude.degrees + parseFloat(gpsData.longitude.minutes) / 60;
  const { darkMode } = useDarkMode();

  return (
    <div className={`space-y-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
      <h2
        className={`text-xl font-bold ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {vehicle.type === "car" ? "🚗" : "🚚"} {vehicle.id}
      </h2>
      <div
        className={`grid grid-cols-2 gap-4 p-4 rounded-lg ${
          darkMode ? "bg-gray-800" : "bg-gray-100"
        }`}
      >
        <div>
          <h3
            className={`text-md font-semibold ${
              darkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Posición
          </h3>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Latitud: {lat.toFixed(6)}°
          </p>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Longitud: {lng.toFixed(6)}°
          </p>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Altitud: {gpsData.altitude.value} {gpsData.altitude.unit}
          </p>
        </div>
        <div>
          <h3
            className={`text-md font-semibold ${
              darkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Estado
          </h3>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Velocidad: {(Math.random() * 100).toFixed(2)} km/h
          </p>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Dirección: {(Math.random() * 360).toFixed(2)}°
          </p>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Batería: {(Math.random() * 100).toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}
