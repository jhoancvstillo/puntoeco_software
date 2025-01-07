export interface GPSData {
    type: string;
    time: string;
    latitude: {
      degrees: number;
      minutes: string;
      direction: 'N' | 'S';
    };
    longitude: {
      degrees: number;
      minutes: string;
      direction: 'E' | 'W';
    };
    fix_quality: number;
    satellites: number;
    hdop: number;
    altitude: {
      value: number;
      unit: string;
    };
    geoid_separation: {
      value: number;
      unit: string;
    };
    checksum: string;
  }
  
  
  
export type VehicleType = "car" | "truck";

export interface Vehicle {
  id: string;
  type: VehicleType;
  gpsData: GPSData;
}


export interface MapProps {
  vehicles: Vehicle[]
  selectedVehicles: string[]
  onVehicleSelect: (vehicle: Vehicle) => void
  onVehicleToggle: (vehicleId: string) => void
}