import { useEffect, useState } from "react";

import { GPSData, Vehicle, VehicleType } from "@/types/gps";
export * from "@/types/gps";


export const getRandomInRange = (min: number, max: number, decimals: number = 5): number => {
  const factor = Math.pow(10, decimals);
  return Math.round((Math.random() * (max - min) + min) * factor) / factor;
};

export const simulateGPSData = (currentLat: number, currentLon: number): GPSData => ({
  type: "GPGGA",
  time: new Date().toISOString().split("T")[1].split(".")[0].replace(/:/g, ""),
  latitude: {
    degrees: Math.floor(Math.abs(currentLat)),
    minutes: ((Math.abs(currentLat) % 1) * 60).toFixed(5),
    direction: currentLat >= 0 ? "N" : "S",
  },
  longitude: {
    degrees: Math.floor(Math.abs(currentLon)),
    minutes: ((Math.abs(currentLon) % 1) * 60).toFixed(5),
    direction: currentLon >= 0 ? "E" : "W",
  },
  fix_quality: 1,
  satellites: Math.floor(Math.random() * 5) + 7,
  hdop: getRandomInRange(0.5, 1.5, 1),
  altitude: {
    value: getRandomInRange(10, 20, 1),
    unit: "M",
  },
  geoid_separation: {
    value: getRandomInRange(-30, -20, 1),
    unit: "M",
  },
  checksum: "*" + Math.floor(Math.random() * 100).toString(16).toUpperCase(),
});

export const createVehicle = (id: string, type: VehicleType, initialLat: number, initialLon: number): Vehicle => ({
  id,
  type,
  gpsData: simulateGPSData(initialLat, initialLon),
});

export function useSimulateMultipleGPS(vehicleCount: number = 5) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const initialVehicles = Array.from({ length: vehicleCount }, (_, index) => {
      const type: VehicleType = index % 2 === 0 ? "car" : "truck";
      const id = `vehiculo-${index + 1}`;

      // Centro de Copiapó, con variación alrededor.
      const initialLat = -27.370444 + getRandomInRange(-0.01, 0.01);
      const initialLon = -70.327778 + getRandomInRange(-0.01, 0.01);

      return createVehicle(id, type, initialLat, initialLon);
    });

    setVehicles(initialVehicles);

    const interval = setInterval(() => {
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) => {
          // 1. Recuperar el signo (N/S, E/W) de la posición anterior.
          const directionLat = vehicle.gpsData.latitude.direction === "S" ? -1 : 1;
          const directionLon = vehicle.gpsData.longitude.direction === "W" ? -1 : 1;

          // 2. Convertir degrees + minutes a lat/lon decimal, aplicando el signo.
          const baseLat = directionLat * (
            vehicle.gpsData.latitude.degrees
            + parseFloat(vehicle.gpsData.latitude.minutes) / 60
          );
          const baseLon = directionLon * (
            vehicle.gpsData.longitude.degrees
            + parseFloat(vehicle.gpsData.longitude.minutes) / 60
          );

          // 3. Agregar la variación aleatoria.
          const newLat = baseLat + getRandomInRange(-0.0005, 0.0005);
          const newLon = baseLon + getRandomInRange(-0.0005, 0.0005);

          // 4. Generar nuevo gpsData con la lat/lon finales.
          return {
            ...vehicle,
            gpsData: simulateGPSData(newLat, newLon),
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [vehicleCount]);

  return vehicles;
}
