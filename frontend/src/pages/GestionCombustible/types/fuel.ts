export interface FuelRecord {
  id: string
  date: string
  time: string
  license_plate: string
  driver: string
  factura: string
  guide: string
  boleta: string
  fuel_type: 'DIESEL' | 'GAS'
  liters: number
  price_per_liter: number
  total_invoice: number
  card: string
  observations: string
}

export interface FuelFormValues {
  date: string
  time: string
  license_plate: string
  driver: string
  factura: string
  guide: string
  boleta: string
  fuel_type: 'DIESEL' | 'GAS'
  liters: number
  price_per_liter: number
  card: string
  observations: string
}

